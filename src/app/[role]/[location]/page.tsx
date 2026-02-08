import Link from "next/link";
import { DataTable } from "@/components/salary/DataTable";
import { FilterBar } from "@/components/salary/FilterBar";
import { StatsCards } from "@/components/salary/StatsCards";
import { LegalFooter } from "@/components/salary/LegalFooter";
import { DisclaimerBanner } from "@/components/salary/DisclaimerBanner";

type PageProps = {
  params: Promise<{ role: string; location: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RoleLocationPage({ params, searchParams }: PageProps) {
  const { role, location } = await params;
  const search = await searchParams;
  const decodedRole = decodeURIComponent(role);
  const decodedLocation = decodeURIComponent(location);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <DisclaimerBanner />
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
        <StatsCards role={decodedRole} location={decodedLocation} />
        <DataTable role={decodedRole} location={decodedLocation} searchParams={search} />
      </main>
      <LegalFooter />
    </div>
  );
}
