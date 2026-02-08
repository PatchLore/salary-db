import { Suspense } from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { submissions } from "@/lib/schema";
import { desc, sql } from "drizzle-orm";
import { DisclaimerBanner } from "@/components/salary/DisclaimerBanner";
import { HeroSection } from "@/components/salary/HeroSection";
import { SearchBar } from "@/components/salary/SearchBar";
import { LatestSalariesTable } from "@/components/salary/LatestSalariesTable";
import { SalaryTableSkeleton } from "@/components/salary/SalaryTableSkeleton";
import { LegalFooter } from "@/components/salary/LegalFooter";
import { Button } from "@/components/ui/button";

async function getHomeData() {
  const [latest, countRows, locationRows] = await Promise.all([
    db
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
      .limit(10),
    db.select({ count: sql<number>`count(*)::int` }).from(submissions),
    db
      .selectDistinct({ location: submissions.location })
      .from(submissions)
      .orderBy(submissions.location),
  ]);
  const totalSalaries = countRows[0]?.count ?? 0;
  const locations = locationRows.map((r) => r.location);
  return {
    latest,
    totalSalaries,
    locations,
    locationCount: locations.length,
  };
}

async function HomeContent() {
  const { latest, totalSalaries, locations, locationCount } =
    await getHomeData();
  return (
    <>
      <HeroSection
        totalSalaries={totalSalaries}
        locationCount={locationCount}
      />
      <SearchBar locations={locations} />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
            Latest submissions
          </h2>
          <Button
            asChild
            variant="outline"
            className="rounded-lg border-slate-900 text-slate-900 hover:bg-slate-50 min-h-[44px]"
          >
            <Link href="/submit">Submit salary</Link>
          </Button>
        </div>
        <LatestSalariesTable submissions={latest} />
      </section>
    </>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <DisclaimerBanner />
      <main className="flex-1">
        <Suspense
          fallback={
            <>
              <section className="bg-gradient-to-b from-slate-900 to-slate-800 py-20" />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
                <SalaryTableSkeleton />
              </div>
            </>
          }
        >
          <HomeContent />
        </Suspense>
      </main>
      <LegalFooter />
    </div>
  );
}
