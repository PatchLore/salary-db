"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, MapPin, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type LocationData = {
  location: string;
  totalSubmissions: number;
  roles: Array<{
    role: string;
    count: number;
    minSalary: number;
    maxSalary: number;
  }>;
};

export default function BrowsePage() {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<LocationData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLocations() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/browse");
        if (!res.ok) throw new Error(`Failed to fetch locations: ${res.status}`);
        const data = await res.json();
        setLocations(data);
        setFilteredLocations(data);
      } catch (err) {
        console.error("Error fetching locations:", err);
        setError(err instanceof Error ? err.message : "Failed to load locations");
      } finally {
        setIsLoading(false);
      }
    }

    fetchLocations();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = locations.filter((location) =>
      location.location.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredLocations(filtered);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="flex-1">
        {/* Header */}
        <section className="bg-white border-b border-slate-200 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-2">
                  Browse by Location
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl">
                  Explore developer salaries across different cities and regions worldwide.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="rounded-lg border-2 border-slate-900 text-slate-900 hover:bg-slate-100 font-semibold min-h-[44px] transition-all duration-200 whitespace-nowrap"
              >
                <Link href="/">View all salaries →</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Search */}
        <section className="bg-white border-b border-slate-200 py-8 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 h-12 text-lg border-slate-300"
              />
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>
                <p className="mt-4 text-slate-600">Loading locations...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-600 text-lg">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          ) : filteredLocations.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-600 text-lg">
                {searchQuery
                  ? `No locations found matching "${searchQuery}"`
                  : "No data yet. Be the first to submit."}
              </p>
            </div>
          ) : (
            <div className="grid gap-8">
              {filteredLocations.map((locationData) => (
                <div
                  key={locationData.location}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 transition-colors"
                >
                  {/* Location Header */}
                  <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-white flex-shrink-0" />
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white">
                          {locationData.location}
                        </h2>
                        <p className="text-slate-300 text-sm mt-1">
                          {locationData.totalSubmissions} total submission{locationData.totalSubmissions !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Roles Section */}
                  <div className="p-6">
                    {/* Subtitle */}
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
                      {locationData.roles.length === 1
                        ? "Available role"
                        : `Popular roles (Top ${locationData.roles.length})`}
                    </h3>

                    {/* Roles Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      {locationData.roles.map((role) => (
                        <Link
                          key={`${locationData.location}-${role.role}`}
                          href={`/${encodeURIComponent(role.role)}/${encodeURIComponent(
                            locationData.location
                          )}`}
                          className="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:bg-slate-100 hover:border-slate-300 transition-all duration-200 group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-slate-900 group-hover:text-slate-900 text-sm sm:text-base leading-tight pr-2">
                              {role.role}
                            </h3>
                            <span className="text-xs font-medium bg-slate-200 text-slate-700 px-2 py-1 rounded whitespace-nowrap flex-shrink-0">
                              {role.count}
                            </span>
                          </div>

                          {/* Salary Range */}
                          <div className="flex items-baseline gap-2 text-sm">
                            <DollarSign className="h-4 w-4 text-slate-400 flex-shrink-0" />
                            <span className="text-slate-600">
                              ${(role.minSalary / 1000).toFixed(0)}k –{" "}
                              <span className="font-semibold text-slate-900">
                                ${(role.maxSalary / 1000).toFixed(0)}k
                              </span>
                            </span>
                          </div>

                          {/* Arrow indicator */}
                          <div className="mt-3 inline-flex items-center text-slate-400 group-hover:text-slate-900 transition-colors text-xs">
                            View salary data →
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Message when only 1 role */}
                    {locationData.roles.length === 1 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-900 mt-4">
                        <p>
                          Be the first to submit a different role in{" "}
                          <span className="font-semibold">{locationData.location}</span>!
                        </p>
                      </div>
                    )}

                    {/* View all for this location */}
                    <Button
                      asChild
                      variant="ghost"
                      className="mt-4 text-slate-700 hover:text-slate-900 text-sm"
                    >
                      <Link href={`/?location=${encodeURIComponent(locationData.location)}`}>
                        View all {locationData.totalSubmissions} salaries in {locationData.location} →
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-slate-600 hover:text-slate-900">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/submit" className="text-slate-600 hover:text-slate-900">
                    Submit Salary
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-slate-600 hover:text-slate-900">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-slate-600 hover:text-slate-900">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Info</h3>
              <p className="text-slate-600 text-sm">
                Real developer salaries. Anonymous. Global. Updated daily.
              </p>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
            <p>&copy; 2026 Developer Salaries. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
