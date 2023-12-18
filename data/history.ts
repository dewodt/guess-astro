import "server-only";

import { addDays } from "date-fns";
import { ModesType } from "@/types/constants";
import { db } from "@/lib/drizzle";
import { match, type Match } from "@/db/schema";
import type { SearchParams } from "@/types/data-table";
import { and, asc, desc, eq, gte, inArray, lte, or, sql } from "drizzle-orm";
import { dataTableSearchParamsSchema } from "@/lib/zod";
import { getServerSession, type Session } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function getHistoryData(
  mode: ModesType,
  searchParams: SearchParams
) {
  // Validate search params to prevent SQL injection
  const rawSearchParams = dataTableSearchParamsSchema.safeParse(searchParams);

  // If search params is invalid, return empty array
  if (!rawSearchParams.success) {
    return { allHistory: [], pageCount: 0 };
  }

  // Valid search params, destructure search params
  const { page, per_page, sort, result, createdAt, operator } =
    rawSearchParams.data;

  // Get user's session (session is already validated in middleware)
  const session = (await getServerSession(authOptions)) as Session;

  // Number of items to skip
  const offset = (page - 1) * per_page;

  // Column and order to sort by
  // Spliting the sort string by "." to get the column and order
  // Example: "title.desc" => ["title", "desc"]
  // Default sort is by createdAt descending
  const [column, order] = (sort?.split(".") as [
    "createdAt",
    "asc" | "desc"
  ]) ?? ["createdAt", "desc"];

  // Column to filter by
  // No default value
  const results = (result?.split(".") as Match["result"][]) ?? undefined;
  const dateRangeStr = (createdAt?.split(".") as string[]) ?? undefined;

  const dateRange = dateRangeStr
    ? {
        from: new Date(dateRangeStr[0]),
        to: addDays(new Date(dateRangeStr[1]), 1),
      }
    : undefined;

  // Get all history (filtered) with offset & limit
  const allHistoryQuery = db
    .select()
    .from(match)
    .limit(per_page)
    .offset(offset)
    .where(
      and(
        eq(match.userId, session.id),
        eq(match.mode, mode),
        !operator || operator === "and"
          ? and(
              // Filter history by result
              results ? inArray(match.result, results) : undefined,
              dateRange
                ? and(
                    gte(match.createdAt, dateRange.from),
                    lte(match.createdAt, dateRange.to)
                  )
                : undefined
            )
          : or(
              // Filter history by result
              results ? inArray(match.result, results) : undefined,
              dateRange
                ? and(
                    gte(match.createdAt, dateRange.from),
                    lte(match.createdAt, dateRange.to)
                  )
                : undefined
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
              results ? inArray(match.result, results) : undefined,
              dateRange
                ? and(
                    gte(match.createdAt, dateRange.from),
                    lte(match.createdAt, dateRange.to)
                  )
                : undefined
            )
          : or(
              // Filter history by result
              results ? inArray(match.result, results) : undefined,
              dateRange
                ? and(
                    gte(match.createdAt, dateRange.from),
                    lte(match.createdAt, dateRange.to)
                  )
                : undefined
            )
      )
    );

  const [allHistory, [{ total }]] = await Promise.all([
    allHistoryQuery,
    totalHistoryQuery,
  ]);

  const pageCount = Math.ceil(total / per_page);

  return { allHistory, pageCount };
}
