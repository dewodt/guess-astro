"use server";

import { user } from "@/db/schema";
import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/drizzle";
import PostHogClient from "@/lib/posthog-server";
import {
  getZodParseErrorPaths,
  getZodParseErrorDescription,
} from "@/lib/utils";
import { registerOrUpdateUserSchema } from "@/lib/zod";
import { eq, ne, and, sql } from "drizzle-orm";
import { getServerSession, type Session } from "next-auth";

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
      title: "Error",
      description: description,
      errorPaths: errorPaths,
    };
  }

  // If parsing success
  const userFormData = zodParseResult.data;

  // Find if username target is available by finding other user's username that is equal to username target (stored in userFormData)
  const data = await db.query.user.findFirst({
    where: and(
      ne(user.id, session.id),
      eq(sql`LOWER(${user.username})`, userFormData.username.toLowerCase())
    ),
  });

  // Username is not available
  if (data) {
    return {
      ok: false,
      title: "Error",
      description: `Username "${userFormData.username}" is not available`,
      errorPaths: [
        {
          path: "username",
          description: `Username "${userFormData.username}" is not available`,
        },
      ],
    };
  }

  // Update user data
  await db
    .update(user)
    .set({
      name: userFormData.name,
      username: userFormData.username,
      image: userFormData.image,
    })
    .where(eq(user.id, session.id));

  // Initialize posthog client
  const posthogClient = PostHogClient();

  // Send data to PostHog user updated his/her profile
  posthogClient.capture({
    distinctId: session.id,
    event: "user_updated_profile",
  });

  return {
    ok: true,
    title: "Success",
    description: "Profile updated successfully",
  };
};
