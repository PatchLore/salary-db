import { Users, MapPin, RefreshCw } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";

type HeroSectionProps = {
  totalSalaries: number;
  locationCount: number;
};

export function HeroSection({ totalSalaries, locationCount }: HeroSectionProps) {
  return (
    <section
      className="relative bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
      }}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight"
          style={{ letterSpacing: "-0.02em" }}
        >
          Developer Salaries 2026
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-slate-300 max-w-2xl">
          Real salaries from real developers. Anonymous. Global.
        </p>
        <div
          className="mt-10 flex flex-wrap items-center gap-6 sm:gap-8 text-slate-400"
          role="list"
        >
          <div className="flex items-center gap-2 min-h-[44px]">
            <Users className="h-5 w-5 text-slate-500 shrink-0" aria-hidden />
            <span className="text-sm font-medium text-slate-300">
              <AnimatedCounter end={Math.min(totalSalaries, 99)} />
              {" "}Salaries
            </span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-slate-600" aria-hidden />
          <div className="flex items-center gap-2 min-h-[44px]">
            <MapPin className="h-5 w-5 text-slate-500 shrink-0" aria-hidden />
            <span className="text-sm font-medium text-slate-300">
              {locationCount}+ Locations
            </span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-slate-600" aria-hidden />
          <div className="flex items-center gap-2 min-h-[44px]">
            <RefreshCw className="h-5 w-5 text-slate-500 shrink-0" aria-hidden />
            <span className="text-sm font-medium text-slate-300">
              Updated Daily
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
