import Link from "next/link";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

type LatestSalariesTableProps = {
  submissions: Array<{
    id: number;
    role: string;
    location: string;
    salaryMin: number;
    salaryMax: number;
    yearsExp: number;
    companySize: string;
  }>;
};

function formatSalary(min: number, max: number) {
  const fmt = (n: number) =>
    n >= 1000 ? `$${n / 1000}k` : `$${n}`;
  return `${fmt(min)} – ${fmt(max)}`;
}

/** WCAG AA: emerald-700 on white meets contrast. Use green scale for salary emphasis. */
function getSalaryClassName(min: number, max: number) {
  const mid = (min + max) / 2;
  if (mid >= 150_000) return "font-semibold text-emerald-700";
  if (mid >= 100_000) return "font-semibold text-emerald-600";
  return "font-medium text-emerald-600";
}

export function LatestSalariesTable({ submissions }: LatestSalariesTableProps) {
  if (submissions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center transition-shadow duration-200 hover:shadow-md">
        <Briefcase className="h-16 w-16 text-slate-400 mx-auto mb-4" aria-hidden />
        <h3 className="text-xl font-semibold text-slate-900">
          No salaries match your filters
        </h3>
        <p className="text-slate-600 mt-2 max-w-sm mx-auto">
          Be the first to submit a salary and help others.
        </p>
        <Button asChild className="mt-6 bg-slate-900 hover:bg-slate-800 rounded-lg min-h-[44px] px-6 font-semibold transition-all duration-200">
          <Link href="/submit">Submit a salary</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-shadow duration-200 hover:shadow-md">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-slate-200 bg-slate-100">
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-700">
                Role
              </th>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-700">
                Location
              </th>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-700">
                Salary range
              </th>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-700">
                Exp
              </th>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-700">
                Company size
              </th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((row, i) => (
              <tr
                key={row.id}
                className="border-b border-slate-100 last:border-0 bg-white hover:bg-emerald-50/50 transition-colors duration-150 animate-fade-in-up opacity-0"
                style={{
                  animationDelay: `${i * 50}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <td className="px-5 py-4">
                  <Link
                    href={`/${encodeURIComponent(row.role)}/${encodeURIComponent(row.location)}`}
                    className="font-semibold text-slate-900 hover:text-slate-700 hover:underline transition-colors duration-150"
                  >
                    {row.role}
                  </Link>
                </td>
                <td className="px-5 py-4 text-slate-700">{row.location}</td>
                <td className={`px-5 py-4 ${getSalaryClassName(row.salaryMin, row.salaryMax)}`}>
                  {formatSalary(row.salaryMin, row.salaryMax)}
                </td>
                <td className="px-5 py-4 text-slate-700">{row.yearsExp} yr</td>
                <td className="px-5 py-4 text-slate-700">{row.companySize}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {submissions.map((row) => (
          <Link
            key={row.id}
            href={`/${encodeURIComponent(row.role)}/${encodeURIComponent(row.location)}`}
            className="block bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md hover:bg-emerald-50/30 hover:border-slate-300 transition-all duration-200 min-h-[44px]"
          >
            <div className="flex justify-between items-start gap-2">
              <div>
                <p className="font-semibold text-slate-900">{row.role}</p>
                <p className="text-sm text-slate-600">{row.location}</p>
              </div>
              <p className={`shrink-0 ${getSalaryClassName(row.salaryMin, row.salaryMax)}`}>
                {formatSalary(row.salaryMin, row.salaryMax)}
              </p>
            </div>
            <div className="mt-2 flex gap-3 text-sm text-slate-600">
              <span>{row.yearsExp} yr exp</span>
              <span>{row.companySize}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-center pt-2">
        <Link
          href="/browse"
          className="text-sm font-semibold text-slate-900 hover:text-slate-700 hover:underline min-h-[44px] inline-flex items-center transition-colors duration-150"
        >
          View all salaries →
        </Link>
      </div>
    </div>
  );
}
