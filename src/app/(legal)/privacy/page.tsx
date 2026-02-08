import Link from "next/link";
import { legal } from "@/lib/legal";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight">Privacy</h1>
      <p className="text-muted-foreground mt-2">{legal.dataRetention}.</p>
      <div className="prose dark:prose-invert mt-8">
        <p>
          We do not store raw IP addresses. Hashed values are used only for
          rate limiting submissions.
        </p>
      </div>
      <Link href="/" className="text-primary hover:underline mt-8 inline-block">
        ← Back home
      </Link>
    </div>
  );
}
