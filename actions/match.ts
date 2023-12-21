"use server";

import { getServerSession, type Session } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/drizzle";
import { MatchAnswerSchema } from "@/lib/zod";
import { astronomicalObject, match } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  getZodParseErrorPaths,
  getZodParseErrorDescription,
} from "@/lib/utils";
import PostHogClient from "@/lib/posthog-server";

export const MatchAction = async (formData: FormData) => {
  // Get session
  // Session is already validated in middleware, safe to assume session is not undefined/null
  const session = (await getServerSession(authOptions)) as Session;

  // Create object from form data
  const formObject = {};
  Object.assign(formObject, { id: formData.get("id") });
  Object.assign(formObject, { mode: formData.get("mode") });
  Object.assign(formObject, { answer: formData.get("answer") });

  // Safe parse with zod (return an object)
  const zodParseResult = MatchAnswerSchema.safeParse(formObject);
  if (!zodParseResult.success) {
    // Get zod error path
    const errorPaths = getZodParseErrorPaths(zodParseResult);

    // Get error description
    const description = getZodParseErrorDescription(zodParseResult);

    return {
      ok: false,
      title: "Invalid Submission Data.",
      description: description,
      errorPaths: errorPaths,
    };
  }

  // If parsing success
  const answer = zodParseResult.data;

  // Get the correct answer data
  const [data] = await db
    .select({
      id: astronomicalObject.id,
      name: astronomicalObject.name,
      imageAnswerUrl: astronomicalObject.imageAnswerUrl,
    })
    .from(astronomicalObject)
    .where(eq(astronomicalObject.id, answer.id));

  // Check if answer is correct
  const isCorrect = data.name === answer.answer;
  const result = isCorrect ? "correct" : "incorrect";
  const title = isCorrect ? "Correct!" : "Incorrect!";
  const description = isCorrect
    ? "Click next question or quit to the main menu!"
    : `Correct answer is ${data.name}. Click next question or quit to the main menu!`;

  // Update score and match data
  await db.insert(match).values({
    userId: session!.id,
    astronomicalObjectId: answer.id,
    mode: answer.mode,
    result: result,
  });

  // Initialize posthog client
  const posthogClient = PostHogClient();

  // Send data to PostHog
  posthogClient.capture({
    distinctId: session.id,
    event: "match answered",
    properties: {
      mode: answer.mode,
      result: result,
    },
  });

  return {
    ok: true,
    title: title,
    description: description,
    isCorrect: isCorrect,
    correctAnswerImageUrl: data.imageAnswerUrl,
  };
};
