import Link from "next/link";
import type { Metadata } from "next";
import { DataTable } from "@/components/salary/DataTable";
import { FilterBar } from "@/components/salary/FilterBar";
import { StatsCards } from "@/components/salary/StatsCards";

type PageProps = {
  params: Promise<{ role: string; location: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { role, location } = await params;
  const decodedRole = decodeURIComponent(role);
  const decodedLocation = decodeURIComponent(location);
  const title = `${decodedRole} Salaries in ${decodedLocation}`;
  const description = `Anonymous salary data for ${decodedRole} in ${decodedLocation}. Self-reported developer pay.`;
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function RoleLocationPage({ params, searchParams }: PageProps) {
  const { role, location } = await params;
  const search = await searchParams;
  const decodedRole = decodeURIComponent(role);
  const decodedLocation = decodeURIComponent(location);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span className="font-medium text-foreground">{decodedRole}</span>
          <span>/</span>
          <span className="font-medium text-foreground">{decodedLocation}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mt-2">
          {decodedRole} in {decodedLocation}
        </h1>
        <FilterBar
          role={decodedRole}
          location={decodedLocation}
          searchParams={search}
        />
        <StatsCards role={decodedRole} location={decodedLocation} searchParams={search} />
        <DataTable role={decodedRole} location={decodedLocation} searchParams={search} />
      </main>
    </div>
  );
}
