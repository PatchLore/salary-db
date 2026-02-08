import Link from "next/link";
import type { Metadata } from "next";
import { legal } from "@/lib/legal";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen container mx-auto px-4 py-8 max-w-3xl bg-slate-50">
      <h1 className="text-3xl font-bold tracking-tight">Privacy</h1>
      <p className="text-muted-foreground mt-2">{legal.dataRetention}.</p>
      <div className="prose dark:prose-invert mt-8">
        <p>
          We do not store raw IP addresses. Hashed values are used only for
          rate limiting submissions.
        </p>
        <h2 className="mt-6 font-semibold">GDPR & data deletion</h2>
        <p>
          We do not collect names, emails, or employer names. If you want data
          associated with your submissions removed, contact us at{" "}
          <a href="mailto:support@devsalaries.co" className="underline">
            support@devsalaries.co
          </a>{" "}
          and we will remove any entries that can be reasonably attributed to
          you (e.g. by submission time and role/location). We cannot identify
          submitters by IP hash.
        </p>
      </div>
      <Link href="/" className="text-primary hover:underline mt-8 inline-block">
        ← Back home
      </Link>
    </div>
  );
}
