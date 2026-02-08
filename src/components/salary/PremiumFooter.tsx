import Link from "next/link";

export function PremiumFooter() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <h3 className="text-white font-semibold text-lg">Developer Salaries</h3>
            <p className="text-sm text-slate-500">Real salaries from real developers. Anonymous. Global.</p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3">
            <Link href="/terms" className="text-sm hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <a href="mailto:contact@devsalaries.dev" className="text-sm hover:text-white transition-colors">
              Contact
            </a>
          </div>

          {/* Built with */}
          <div className="flex flex-col gap-2">
            <p className="text-sm text-slate-500">Built with modern tools:</p>
            <p className="text-xs text-slate-600">Next.js • Neon • Drizzle • Tailwind</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs text-slate-500">© 2026 Developer Salaries. All rights reserved.</p>
          <div className="flex gap-4 text-xs">
            <a href="https://github.com/dnbmashup1-4396s-projects/devsalaries" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors">
              GitHub
            </a>
            <span className="text-slate-700">•</span>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors">
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
