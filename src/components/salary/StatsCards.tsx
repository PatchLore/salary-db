import { db } from "@/lib/db";
import { submissions } from "@/lib/schema";
import { and, eq, sql, inArray } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatsCardsProps = {
  role: string;
  location: string;
  searchParams?: Record<string, string | string[] | undefined>;
};

export async function StatsCards({ role, location, searchParams }: StatsCardsProps) {
  const rawCurrency = searchParams?.currency;
  const currencyFilters: string[] = Array.isArray(rawCurrency)
    ? rawCurrency
    : typeof rawCurrency === "string"
    ? rawCurrency.split(",").filter(Boolean)
    : [];

  const conditions = [
    eq(submissions.role, role),
    eq(submissions.location, location),
  ];
  if (currencyFilters.length > 0) {
    conditions.push(inArray(submissions.currency, currencyFilters));
  }
  const where = and(...conditions);
  // Aggregates
  const [agg] = await db
    .select({
      avgMin: sql<number>`round(avg(${submissions.salaryMin}))::int`,
      avgMax: sql<number>`round(avg(${submissions.salaryMax}))::int`,
      count: sql<number>`count(*)::int`,
    })
    .from(submissions)
    .where(where);

  const count = agg?.count ?? 0;
  const avgMin = agg?.avgMin ?? 0;
  const avgMax = agg?.avgMax ?? 0;

  // Currency distribution (grouped counts)
  const groups = await db
    .select({ currency: submissions.currency, cnt: sql<number>`count(*)::int` })
    .from(submissions)
    .where(where)
    .groupBy(submissions.currency);

  const totalForDistribution = groups.reduce((s, g) => s + (g.cnt ?? 0), 0) || 0;
  const distribution = groups.map((g) => ({ currency: g.currency, count: g.cnt ?? 0, pct: totalForDistribution ? Math.round(((g.cnt ?? 0) / totalForDistribution) * 100) : 0 }));
  // Most common currency
  const mostCommon = distribution.slice().sort((a, b) => b.count - a.count)[0];

  return (
    <div className="grid gap-4 md:grid-cols-3 mt-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold">{count}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Most common currency</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold">{mostCommon ? `${mostCommon.currency} (${mostCommon.pct}%)` : "—"}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Avg min salary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold">{avgMin.toLocaleString()}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Avg max salary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold">{avgMax.toLocaleString()}</span>
        </CardContent>
      </Card>
      <Card className="md:col-span-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Currency distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm">
            {distribution.length === 0 ? "—" : distribution.map((d) => `${d.pct}% ${d.currency}`).join(", ")}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
