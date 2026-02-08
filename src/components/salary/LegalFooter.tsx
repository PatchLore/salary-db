import Link from "next/link";
import { legal } from "@/lib/legal";

export function LegalFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-auto bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <p className="text-sm leading-relaxed">{legal.footerDisclaimer}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Legal
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/terms"
                className="text-sm hover:text-white transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-sm hover:text-white transition-colors"
              >
                Privacy
              </Link>
            </nav>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <a
            href="mailto:support@devsalaries.co"
            className="text-sm hover:text-white transition-colors"
          >
            support@devsalaries.co
          </a>
          <p className="text-xs text-slate-500">
            © {currentYear} DevSalaries. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
