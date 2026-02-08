import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { submissions } from "@/lib/schema";
import { sql, desc } from "drizzle-orm";

export const revalidate = 30; // Revalidate every 30 seconds

export async function GET() {
  try {
    const [stats, latestSubmission] = await Promise.all([
      db
        .select({
          totalSubmissions: sql<number>`count(*)::int`,
          uniqueLocations: sql<number>`count(distinct ${submissions.location})::int`,
        })
        .from(submissions),
      db
        .select({ submittedAt: submissions.submittedAt })
        .from(submissions)
        .orderBy(desc(submissions.submittedAt))
        .limit(1),
    ]);

    const totalSubmissions = stats[0]?.totalSubmissions ?? 0;
    const uniqueLocations = stats[0]?.uniqueLocations ?? 0;
    const lastUpdated = latestSubmission[0]?.submittedAt ?? new Date();

    return NextResponse.json(
      {
        totalSubmissions,
        uniqueLocations,
        lastUpdated,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (err) {
    console.error("Stats API error:", err);
    return NextResponse.json(
      {
        totalSubmissions: 0,
        uniqueLocations: 0,
        lastUpdated: new Date(),
      },
      { status: 500 }
    );
  }
}
