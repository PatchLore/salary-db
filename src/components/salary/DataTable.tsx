import { db } from "@/lib/db";
import { submissions } from "@/lib/schema";
import { and, eq, gte, lte, desc } from "drizzle-orm";
import { searchParamsSchema } from "@/lib/validations";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DataTableProps = {
  role: string;
  location: string;
  searchParams: Record<string, string | string[] | undefined>;
};

export async function DataTable({
  role,
  location,
  searchParams,
}: DataTableProps) {
  const parsed = searchParamsSchema.safeParse({
    salaryMin: Array.isArray(searchParams.salaryMin)
      ? searchParams.salaryMin[0]
      : searchParams.salaryMin,
    salaryMax: Array.isArray(searchParams.salaryMax)
      ? searchParams.salaryMax[0]
      : searchParams.salaryMax,
    companySize: Array.isArray(searchParams.companySize)
      ? searchParams.companySize[0]
      : searchParams.companySize,
    page: Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page ?? "1",
    limit: Array.isArray(searchParams.limit) ? searchParams.limit[0] : searchParams.limit ?? "20",
  });
  const { page, limit, salaryMin, salaryMax, companySize } = parsed.success
    ? parsed.data
    : { page: 1, limit: 20, salaryMin: undefined, salaryMax: undefined, companySize: undefined };

  const conditions = [eq(submissions.role, role), eq(submissions.location, location)];
  if (salaryMin != null) conditions.push(gte(submissions.salaryMin, salaryMin));
  if (salaryMax != null) conditions.push(lte(submissions.salaryMax, salaryMax));
  if (companySize) conditions.push(eq(submissions.companySize, companySize));
  const where = and(...conditions);
  const offset = (page - 1) * limit;

  const rows = await db
    .select({
      id: submissions.id,
      role: submissions.role,
      location: submissions.location,
      salaryMin: submissions.salaryMin,
      salaryMax: submissions.salaryMax,
      yearsExp: submissions.yearsExp,
      companySize: submissions.companySize,
      submittedAt: submissions.submittedAt,
    })
    .from(submissions)
    .where(where)
    .orderBy(desc(submissions.submittedAt))
    .limit(limit)
    .offset(offset);

  return (
    <div className="rounded-md border mt-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Salary range (£)</TableHead>
            <TableHead>Years exp</TableHead>
            <TableHead>Company size</TableHead>
            <TableHead>Submitted</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                No submissions yet. Be the first to submit.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  {row.salaryMin.toLocaleString()} – {row.salaryMax.toLocaleString()}
                </TableCell>
                <TableCell>{row.yearsExp}</TableCell>
                <TableCell>{row.companySize}</TableCell>
                <TableCell>
                  {row.submittedAt
                    ? new Date(row.submittedAt).toLocaleDateString()
                    : "—"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
