import Link from "next/link";
import { legal } from "@/lib/legal";

export function LegalFooter() {
  return (
    <footer className="border-t mt-auto py-6 px-4">
      <div className="container mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>{legal.footerDisclaimer}</p>
        <nav className="flex gap-4">
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
