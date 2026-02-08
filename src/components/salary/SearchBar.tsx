"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  locations: string[];
};

export function SearchBar({ locations }: SearchBarProps) {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [yearsExp, setYearsExp] = useState([0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const r = role.trim() || "Developer";
    const loc = location || (locations[0] ?? "Remote");
    setIsLoading(true);
    router.push(
      `/${encodeURIComponent(r)}/${encodeURIComponent(loc)}?yearsExpMin=${yearsExp[0]}`
    );
    // Navigation will unmount; if not, reset after a delay
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="sticky top-0 z-20 -mb-8 px-4 sm:px-6">
      <form
        onSubmit={handleSearch}
        className={cn(
          "max-w-7xl mx-auto rounded-xl shadow-lg border border-slate-200/80",
          "bg-white/90 backdrop-blur-md p-4 sm:p-5"
        )}
      >
        <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
          <div className="flex-1 min-w-0">
            <label htmlFor="hero-role" className="sr-only">
              Role
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <Input
                id="hero-role"
                type="search"
                placeholder="e.g. Senior React Developer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="pl-10 min-h-[44px] rounded-lg border-slate-200"
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <label htmlFor="hero-location" className="sr-only">
              Location
            </label>
            <Select value={location || undefined} onValueChange={setLocation}>
              <SelectTrigger
                id="hero-location"
                className="min-h-[44px] rounded-lg border-slate-200"
              >
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <label
                htmlFor="hero-exp"
                className="text-sm font-medium text-slate-700 shrink-0"
              >
                Exp: {yearsExp[0]} yr
              </label>
              <Slider
                id="hero-exp"
                min={0}
                max={15}
                step={1}
                value={yearsExp}
                onValueChange={setYearsExp}
                className="flex-1 min-h-[44px] py-4"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white min-h-[44px] rounded-lg px-6 shrink-0"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Searching…
              </span>
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
