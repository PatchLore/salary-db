import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { submissions } from "@/lib/schema";
import { submissionSchema } from "@/lib/validations";
import { createHash } from "crypto";

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
    const { role, location, salaryMin, salaryMax, yearsExp, companySize } =
      parsed.data;
    const ipHash = getIpHash(request);

    await db.insert(submissions).values({
      role,
      location,
      salaryMin,
      salaryMax,
      yearsExp,
      companySize,
      ipHash,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json(
      { error: "Failed to submit" },
      { status: 500 }
    );
  }
}
