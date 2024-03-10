"use server";

import { astronomicalObject, match } from "@/db/schema";
import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/drizzle";
import PostHogClient from "@/lib/posthog-server";
import {
  getZodParseErrorPaths,
  getZodParseErrorDescription,
} from "@/lib/utils";
import { MatchAnswerSchema } from "@/lib/zod";
import { type MatchResultsType } from "@/types/constants";
import { eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";

export const MatchAction = async (formData: FormData) => {
  // Get & validate session
  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      ok: false,
      title: "Error",
      description: "You are not authenticated",
    };
  }

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
  const userAnswer = zodParseResult.data;

  const correctAnswer = db
    .select({
      name: astronomicalObject.name,
      imageAnswerUrl: astronomicalObject.imageAnswerUrl,
      mode: astronomicalObject.mode,
      result:
        sql<MatchResultsType>`CASE WHEN ${astronomicalObject.name} = ${userAnswer.answer} THEN 'correct'::result ELSE 'incorrect'::result END`.as(
          "result"
        ),
    })
    .from(astronomicalObject)
    .where(eq(astronomicalObject.id, userAnswer.id));

  const withCorrectAnswer = db.$with("correct_answer").as(correctAnswer);

  const [[{ name, imageAnswerUrl, result, mode }]] = await db.batch([
    correctAnswer,
    db
      .with(withCorrectAnswer)
      .insert(match)
      .values({
        userId: session.id,
        astronomicalObjectId: userAnswer.id,
        mode: userAnswer.mode,
        result: sql`(select result from ${withCorrectAnswer})`,
      }),
  ]);

  // Check if answer is correct
  const isCorrect = result === "correct";
  const title = isCorrect ? "Correct!" : "Incorrect!";
  const description = isCorrect
    ? "Click next question or quit to the main menu!"
    : `Correct answer is ${name}. Click next question or quit to the main menu!`;

  // Initialize posthog client
  const posthogClient = PostHogClient();

  // Send data to PostHog
  posthogClient.capture({
    distinctId: session.id,
    event: "match answered",
    properties: {
      mode: mode,
      result: result,
    },
  });

  return {
    ok: true,
    title: title,
    description: description,
    isCorrect: isCorrect,
    correctAnswerImageUrl: imageAnswerUrl,
  };
};
