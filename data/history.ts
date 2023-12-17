import { ModesType } from "@/types/constants";
import "server-only";

import { db } from "@/lib/drizzle";
import { match, type Match } from "@/db/schema";
import type { SearchParams } from "@/types/data-table";
import { and, asc, desc, eq, inArray, or, sql } from "drizzle-orm";

import { dataTableSearchParamsSchema } from "@/lib/zod";
import { getServerSession, type Session } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function getHistoryData(
  mode: ModesType,
  searchParams: SearchParams
) {
  // Get search params
  const { page, per_page, sort, operator, result, dateStart, dateEnd } =
    dataTableSearchParamsSchema.parse(searchParams);

  // Get user's session (session is already validated in middleware)
  const session = (await getServerSession(authOptions)) as Session;

  // Fallback page for invalid page numbers
  const pageAsNumber = Number(page);
  const fallbackPage =
    isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;

  // Number of items per page
  const perPageAsNumber = Number(per_page);
  const limit = isNaN(perPageAsNumber) ? 10 : perPageAsNumber;

  // Number of items to skip
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0;

  // Column and order to sort by
  // Spliting the sort string by "." to get the column and order
  // Example: "title.desc" => ["title", "desc"]
  const [column, order] = (sort?.split(".") as [
    keyof Match | undefined,
    "asc" | "desc" | undefined
  ]) ?? ["createdAt", "desc"];

  // Column to filter by
  const results = (result?.split(".") as Match["result"][]) ?? [];
  const dateStartVal = new Date(dateStart as string) ?? undefined;
  const dateEndVal = new Date(dateEnd as string) ?? undefined;

  // Get all history (filtered) with offset & limit
  const allHistoryQuery = db
    .select()
    .from(match)
    .limit(limit)
    .offset(offset)
    .where(
      and(
        eq(match.userId, session.id),
        eq(match.mode, mode),
        !operator || operator === "and"
          ? and(
              // Filter history by result
              results.length > 0 ? inArray(match.result, results) : undefined
            )
          : or(
              // Filter history by result
              results.length > 0 ? inArray(match.result, results) : undefined
            )
      )
    )
    .orderBy(
      column && column in match
        ? order === "asc"
          ? asc(match[column])
          : desc(match[column])
        : desc(match.id)
    );

  // Get total length of all history (filtered)
  const totalHistoryQuery = db
    .select({
      total: sql<number>`count(${match.id})`,
    })
    .from(match)
    .where(
      and(
        eq(match.userId, session.id),
        eq(match.mode, mode),
        !operator || operator === "and"
          ? and(
              // Filter history by result
              results.length > 0 ? inArray(match.result, results) : undefined
            )
          : or(
              // Filter history by result
              results.length > 0 ? inArray(match.result, results) : undefined
            )
      )
    );

  const [allHistory, [{ total }]] = await Promise.all([
    allHistoryQuery,
    totalHistoryQuery,
  ]);

  const pageCount = Math.ceil(total / limit);

  return { allHistory, pageCount };
}
