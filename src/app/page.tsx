import Link from "next/link";
import { DisclaimerBanner } from "@/components/salary/DisclaimerBanner";
import { LegalFooter } from "@/components/salary/LegalFooter";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <DisclaimerBanner />
        <h1 className="text-3xl font-bold tracking-tight mt-6">
          Salary database
        </h1>
        <p className="text-muted-foreground mt-2">
          Browse self-reported salary data by role and location.
        </p>
        <div className="flex gap-4 mt-8">
          <Button asChild>
            <Link href="/submit">Submit salary</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/software-engineer/london">Browse (example)</Link>
          </Button>
        </div>
      </main>
      <LegalFooter />
    </div>
  );
}
