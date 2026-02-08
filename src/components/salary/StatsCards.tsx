import { db } from "@/lib/db";
import { submissions } from "@/lib/schema";
import { and, eq, sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatsCardsProps = {
  role: string;
  location: string;
};

export async function StatsCards({ role, location }: StatsCardsProps) {
  const conditions = [
    eq(submissions.role, role),
    eq(submissions.location, location),
  ];
  const where = and(...conditions);

  const [avg] = await db
    .select({
      avgMin: sql<number>`round(avg(${submissions.salaryMin}))::int`,
      avgMax: sql<number>`round(avg(${submissions.salaryMax}))::int`,
      count: sql<number>`count(*)::int`,
    })
    .from(submissions)
    .where(where);

  const count = avg?.count ?? 0;
  const avgMin = avg?.avgMin ?? 0;
  const avgMax = avg?.avgMax ?? 0;

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
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Avg min salary (£)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold">{avgMin.toLocaleString()}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Avg max salary (£)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold">{avgMax.toLocaleString()}</span>
        </CardContent>
      </Card>
    </div>
  );
}
