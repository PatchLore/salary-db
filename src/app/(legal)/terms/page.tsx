import Link from "next/link";
import type { Metadata } from "next";
import { legal } from "@/lib/legal";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen container mx-auto px-4 py-8 max-w-3xl bg-slate-50">
      <h1 className="text-3xl font-bold tracking-tight">Terms of use</h1>
      <p className="text-muted-foreground mt-2">
        Jurisdiction: {legal.termsJurisdiction}. {legal.dataRetention}.
      </p>
      <div className="prose dark:prose-invert mt-8">
        <p>
          This site is for informational purposes only. Data is self-reported
          and unverified. Use at your own discretion.
        </p>
      </div>
      <Link href="/" className="text-primary hover:underline mt-8 inline-block">
        ← Back home
      </Link>
    </div>
  );
}
