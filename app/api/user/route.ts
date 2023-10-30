import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { registerOrUpdateUserSchema } from "@/lib/zod";
import { formDataToObject, getZodParseErrors } from "@/lib/utils";
import { db } from "@/lib/drizzle";
import { eq, ne, and } from "drizzle-orm";
import { user } from "@/db/schema";
import { uploadAvatar } from "@/lib/cloudinary";

// Force dynamic page
export const dynamic = "force-dynamic";

// Update or Register user data
export const PUT = async (req: NextRequest) => {
  // Check if user has session
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      {
        error: "Unauthorized request",
        message: "Please sign in to have access.",
      },
      { status: 401 }
    );
  }

  // Convert back form data to object
  const formData = await req.formData();
  const formObject = formDataToObject(formData) as unknown;

  // Check data schema with zod
  const zodParseResult = registerOrUpdateUserSchema.safeParse(formObject);
  if (!zodParseResult.success) {
    // Get zod error each path and message
    const paths = getZodParseErrors(zodParseResult);

    return NextResponse.json(
      {
        error: "Bad Request",
        message: "Data is not valid",
        paths: paths,
      },
      { status: 400 }
    );
  }

  // If parsing success
  const userFormData = zodParseResult.data;

  // Find if username is available
  const data = await db.query.user.findFirst({
    where: and(
      eq(user.username, userFormData.username),
      ne(user.id, session.id)
    ),
  });

  // Check if username is available
  if (data) {
    return NextResponse.json(
      {
        error: "Bad Request",
        message: "Username is not available",
        paths: [
          {
            path: "username",
            message: "Username is not available",
          },
        ],
      },
      { status: 400 }
    );
  }

  // Update user data
  if (userFormData.image) {
    // User's avatar is updated
    // Upload avatar to cloudinary
    const imageUrl =
      userFormData.image === "DELETE"
        ? null
        : await uploadAvatar(session.id, userFormData.image);

    // Update database
    await db
      .update(user)
      .set({
        name: userFormData.name,
        username: userFormData.username,
        image: imageUrl,
      })
      .where(eq(user.id, session.id));
  } else {
    // User's avatar is not updated
    // Update database
    await db
      .update(user)
      .set({
        name: userFormData.name,
        username: userFormData.username,
      })
      .where(eq(user.id, session.id));
  }

  return NextResponse.json({ message: "User data updated" }, { status: 200 });
};
