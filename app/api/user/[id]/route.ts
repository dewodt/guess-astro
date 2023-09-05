import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { registerOrUpdateUserSchema } from "@/lib/zod";
import { formDataToObject } from "@/lib/utils";
import { db } from "@/lib/drizzle";
import { eq, ne, and } from "drizzle-orm";
import * as z from "zod";
import { user } from "@/db/schema";
import { uploadAvatar } from "@/lib/cloudinary";

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
  const rawFormObject = formDataToObject(formData); // Raw Type
  const formObject = rawFormObject as z.infer<
    typeof registerOrUpdateUserSchema
  >; // Validated Type

  // Check data schema with zod
  const validationResult = registerOrUpdateUserSchema.safeParse(rawFormObject);
  if (!validationResult.success) {
    // Convert zod error to string
    const ArrayOfErrorMessages = validationResult.error.errors.map(
      (error) => `${error.path.join(", ")}: ${error.message}`
    );
    const errorMessage = ArrayOfErrorMessages.join("\n");

    return NextResponse.json(
      {
        error: "Bad Request",
        message: errorMessage,
      },
      { status: 400 }
    );
  }

  // Find if username is available
  const data = await db
    .select()
    .from(user)
    .where(
      and(eq(user.username, formObject.username), ne(user.id, session.id))
    );

  // Check if username is available
  if (data.length !== 0) {
    return NextResponse.json(
      {
        error: "Bad Request",
        message: "Username is not available",
      },
      { status: 400 }
    );
  }

  // Update user data
  if (formObject.image) {
    // Upload avatar to cloudinary
    const imageUrl = await uploadAvatar(session.id, formObject.image);

    // Update database
    await db
      .update(user)
      .set({
        name: formObject.name,
        username: formObject.username,
        image: imageUrl,
      })
      .where(eq(user.id, session.id));
  } else {
    // Update database
    await db
      .update(user)
      .set({
        name: formObject.name,
        username: formObject.username,
      })
      .where(eq(user.id, session.id));
  }

  return NextResponse.json({ message: "User data updated" }, { status: 200 });
};
