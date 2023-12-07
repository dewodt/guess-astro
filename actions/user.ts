"use server";

import { getServerSession, type Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { registerOrUpdateUserSchema } from "@/lib/zod";
import { db } from "@/lib/drizzle";
import { eq, ne, and } from "drizzle-orm";
import { user } from "@/db/schema";
import { uploadAvatar } from "@/lib/cloudinary";
import {
  getZodParseErrorPaths,
  getZodParseErrorDescription,
} from "@/lib/utils";

export const UserAction = async (formData: FormData) => {
  // Get session
  // Session is already validated in middleware, safe to assume session is not undefined/null
  const session = (await getServerSession(authOptions)) as Session;

  // Create object from form data
  const formObject = {};
  Object.assign(formObject, { name: formData.get("name") });
  Object.assign(formObject, { username: formData.get("username") });
  Object.assign(formObject, { image: formData.get("image") });

  // Check data schema with zod
  const zodParseResult = registerOrUpdateUserSchema.safeParse(formObject);
  if (!zodParseResult.success) {
    // Get zod error each path and message
    const errorPaths = getZodParseErrorPaths(zodParseResult);

    // Get zod error description
    const description = getZodParseErrorDescription(zodParseResult);

    return {
      ok: false,
      title: "Invalid Submission Data.",
      description: description,
      errorPaths: errorPaths,
    };
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
    return {
      ok: false,
      title: "Invalid Submission Data.",
      description: "Username is not available",
      errorPaths: [
        {
          path: "username",
          description: "Username is not available",
        },
      ],
    };
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

  return {
    ok: true,
    title: "Success",
    description: "User data is updated successfully",
  };
};
