import { Users, MapPin, RefreshCw } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";

type HeroSectionProps = {
  totalSalaries: number;
  locationCount: number;
};

export function HeroSection({ totalSalaries, locationCount }: HeroSectionProps) {
  return (
    <section className="relative bg-white border-b border-slate-200 overflow-hidden">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,.5) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]"
          style={{ letterSpacing: "-0.025em" }}
        >
          Developer Salaries 2026
        </h1>
        <p className="mt-5 sm:mt-6 text-lg sm:text-xl md:text-2xl text-slate-600 max-w-2xl leading-snug font-medium">
          Real salaries from real developers. Anonymous. Global.
        </p>
        <div
          className="mt-12 flex flex-wrap items-stretch gap-3 sm:gap-4"
          role="list"
        >
          <div
            className="flex items-center gap-3 rounded-xl bg-slate-100 border border-slate-200 px-4 py-3 min-h-[52px] transition-all duration-200 hover:bg-slate-200/80 hover:border-slate-300"
            role="listitem"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Users className="h-4 w-4" aria-hidden />
            </div>
            <span className="text-sm font-semibold text-slate-900">
              <AnimatedCounter end={Math.min(totalSalaries, 99)} />
              {" "}Salaries
            </span>
          </div>
          <div
            className="flex items-center gap-3 rounded-xl bg-slate-100 border border-slate-200 px-4 py-3 min-h-[52px] transition-all duration-200 hover:bg-slate-200/80 hover:border-slate-300"
            role="listitem"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
              <MapPin className="h-4 w-4" aria-hidden />
            </div>
            <span className="text-sm font-semibold text-slate-900">
              {locationCount}+ Locations
            </span>
          </div>
          <div
            className="flex items-center gap-3 rounded-xl bg-slate-100 border border-slate-200 px-4 py-3 min-h-[52px] transition-all duration-200 hover:bg-slate-200/80 hover:border-slate-300"
            role="listitem"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
              <RefreshCw className="h-4 w-4" aria-hidden />
            </div>
            <span className="text-sm font-semibold text-slate-900">
              Updated Daily
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
