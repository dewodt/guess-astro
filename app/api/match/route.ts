import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { MatchAnswerSchema } from "@/lib/zod";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { astronomicalObject, match } from "@/db/schema";
import { eq } from "drizzle-orm";
import { formDataToObject, getZodParseErrorMessage } from "@/lib/utils";

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
  const formObject = formDataToObject(formData) as unknown;

  // Safe parse with zod (return an object)
  const zodParseResult = MatchAnswerSchema.safeParse(formObject);
  if (!zodParseResult.success) {
    // Convert zod error to string
    const errorMessage = getZodParseErrorMessage(zodParseResult);

    return NextResponse.json(
      {
        error: "Bad Request",
        message: errorMessage,
      },
      { status: 400 }
    );
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
  const isWin = data.name === answer.answer;
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
      message: "Answer submitted successfully.",
      isWin: isWin,
      correctAnswerName: data.name,
      correctAnswerImageUrl: data.imageAnswerUrl,
    },
    { status: 200 }
  );
};
