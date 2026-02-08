import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { submissions } from "@/lib/schema";
import { and, eq, gte, lte, sql, desc } from "drizzle-orm";
import { searchParamsSchema } from "@/lib/validations";

export const maxDuration = 30;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = searchParamsSchema.safeParse({
      role: searchParams.get("role") ?? undefined,
      location: searchParams.get("location") ?? undefined,
      salaryMin: searchParams.get("salaryMin") ?? undefined,
      salaryMax: searchParams.get("salaryMax") ?? undefined,
      yearsExpMin: searchParams.get("yearsExpMin") ?? undefined,
      companySize: searchParams.get("companySize") ?? undefined,
      page: searchParams.get("page") ?? "1",
      limit: searchParams.get("limit") ?? "20",
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid params", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { role, location, salaryMin, salaryMax, yearsExpMin, companySize, page, limit } =
      parsed.data;

    const conditions = [];
    if (role) conditions.push(eq(submissions.role, role));
    if (location) conditions.push(eq(submissions.location, location));
    if (salaryMin != null) conditions.push(gte(submissions.salaryMin, salaryMin));
    if (salaryMax != null) conditions.push(lte(submissions.salaryMax, salaryMax));
    if (yearsExpMin != null) conditions.push(gte(submissions.yearsExp, yearsExpMin));
    if (companySize) conditions.push(eq(submissions.companySize, companySize));

    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const offset = (page - 1) * limit;

    const rows = await db
      .select()
      .from(submissions)
      .where(where)
      .orderBy(desc(submissions.submittedAt))
      .limit(limit)
      .offset(offset);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(submissions)
      .where(where);

    return NextResponse.json({
      data: rows,
      total: countResult?.count ?? 0,
      page,
      limit,
    });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
