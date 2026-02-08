import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { submissions } from "@/lib/schema";
import { sql, desc } from "drizzle-orm";

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    // Get all distinct locations
    const locations = await db
      .selectDistinct({ location: submissions.location })
      .from(submissions)
      .orderBy(submissions.location);

    // For each location, get the top 3 roles with salary info
    const locationData = await Promise.all(
      locations.map(async (loc) => {
        // Query: GROUP BY location AND role, get top 3 roles by submission count
        const roles = await db
          .select({
            role: submissions.role,
            count: sql<number>`count(*)::int`,
            minSalary: sql<number>`min(${submissions.salaryMin})::int`,
            maxSalary: sql<number>`max(${submissions.salaryMax})::int`,
          })
          .from(submissions)
          .where(sql`${submissions.location} = ${loc.location}`)
          .groupBy(submissions.role)
          .orderBy(
            desc(sql`count(*)`),
            submissions.role // Secondary sort by role name for consistency
          )
          .limit(3);

        // Get total submission count for this location
        const totalCount = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(submissions)
          .where(sql`${submissions.location} = ${loc.location}`);

        return {
          location: loc.location,
          totalSubmissions: totalCount[0]?.count ?? 0,
          roles: roles.map((r) => ({
            role: r.role,
            count: r.count,
            minSalary: r.minSalary || 0,
            maxSalary: r.maxSalary || 0,
          })),
        };
      })
    );

    return NextResponse.json(locationData, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (err) {
    console.error("Browse API error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
