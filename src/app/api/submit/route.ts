import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { submissions } from "@/lib/schema";
import { submissionSchema } from "@/lib/validations";
import { and, eq, gt, sql } from "drizzle-orm";
import { createHash } from "crypto";

const RATE_LIMIT_HOURS = 1;

function getIpHash(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0]?.trim() : "unknown";
  return createHash("sha256").update(ip).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = submissionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { role, location, salaryMin, salaryMax, yearsExp, companySize, currency } =
      parsed.data;
    const ipHash = getIpHash(request);

    const oneHourAgo = new Date(Date.now() - RATE_LIMIT_HOURS * 60 * 60 * 1000);
    const [recent] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(submissions)
      .where(and(eq(submissions.ipHash, ipHash), gt(submissions.submittedAt, oneHourAgo)));
    if ((recent?.count ?? 0) > 0) {
      return NextResponse.json(
        { error: "Rate limit exceeded. One submission per hour per IP." },
        {
          status: 429,
          headers: {
            "Retry-After": "3600",
            "X-RateLimit-Limit": "1",
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    await db.insert(submissions).values({
      role,
      location,
      salaryMin,
      salaryMax,
      currency,
      yearsExp,
      companySize,
      ipHash,
    });

    revalidatePath("/");
    revalidatePath("/browse");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json(
      { error: "Failed to submit" },
      { status: 500 }
    );
  }
}
