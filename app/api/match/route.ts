import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { MatchAnswerSchema } from "@/lib/zod";
import * as z from "zod";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { astronomicalObject, match } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { formDataToObject } from "@/lib/utils";

// Post Request
export const POST = async (req: NextRequest) => {
  // Validate user session
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

  // Validate input
  const formData = await req.formData();
  const answer = formDataToObject(formData) as z.infer<
    typeof MatchAnswerSchema
  >;

  // Safe parse with zod (return an object)
  const validationResult = MatchAnswerSchema.safeParse(answer);
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

  // Check if answer is correct
  const data = await db
    .select({ imageAnswerUrl: astronomicalObject.imageAnswerUrl })
    .from(astronomicalObject)
    .where(
      and(
        eq(astronomicalObject.id, answer.id),
        eq(astronomicalObject.name, answer.answer)
      )
    );
  const isWin = data.length != 0;
  const result = isWin ? "win" : "lose";

  // Update score and match data
  await db.insert(match).values({
    userId: session!.id,
    astronomicalObjectId: answer.id,
    mode: answer.mode,
    result: result,
  });

  // Response
  // Note: Don't use undefined in json. (null is ok).
  // Only return imageAnswerUrl if answer is correct so data[0] is not undefined
  return NextResponse.json(
    {
      isWin: isWin,
      ...(isWin && { imageAnswerUrl: data[0].imageAnswerUrl }),
      message: "Answer submitted successfully.",
    },
    { status: 200 }
  );
};
