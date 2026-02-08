import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { submissions } from "@/lib/schema";
import { desc, sql } from "drizzle-orm";

export const revalidate = 30; // Revalidate every 30 seconds

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "20", 10));
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(submissions);
    const totalCount = countResult[0]?.count ?? 0;

    // Get paginated data
    const data = await db
      .select({
        id: submissions.id,
        role: submissions.role,
        location: submissions.location,
        salaryMin: submissions.salaryMin,
        salaryMax: submissions.salaryMax,
        yearsExp: submissions.yearsExp,
        companySize: submissions.companySize,
      })
      .from(submissions)
      .orderBy(desc(submissions.submittedAt))
      .offset(offset)
      .limit(limit);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json(
      {
        data,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (err) {
    console.error("Submissions API error:", err);
    return NextResponse.json(
      {
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          totalCount: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      },
      { status: 500 }
    );
  }
}
