import Link from "next/link";
import { db } from "@/lib/db";
import { submissions } from "@/lib/schema";
import { sql } from "drizzle-orm";
import { DisclaimerBanner } from "@/components/salary/DisclaimerBanner";
import { LegalFooter } from "@/components/salary/LegalFooter";

async function getBrowseData() {
  const rows = await db
    .select({
      role: submissions.role,
      location: submissions.location,
      count: sql<number>`count(*)::int`,
    })
    .from(submissions)
    .groupBy(submissions.role, submissions.location)
    .orderBy(submissions.role, submissions.location);
  return rows;
}

export default async function BrowsePage() {
  const combos = await getBrowseData();
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <DisclaimerBanner />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Browse all salaries
        </h1>
        <p className="text-slate-600 mt-2">
          Select a role and location to see salary data.
        </p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {combos.map(({ role, location, count }) => (
            <Link
              key={`${role}-${location}`}
              href={`/${encodeURIComponent(role)}/${encodeURIComponent(location)}`}
              className="block bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md hover:bg-slate-50/80 transition-all min-h-[44px]"
            >
              <span className="font-semibold text-slate-900">{role}</span>
              <span className="text-slate-500"> · </span>
              <span className="text-slate-600">{location}</span>
              <span className="text-slate-400 text-sm ml-1">({count})</span>
            </Link>
          ))}
        </div>
        {combos.length === 0 && (
          <p className="mt-8 text-slate-500">No data yet. Be the first to submit.</p>
        )}
      </main>
      <LegalFooter />
    </div>
  );
}
