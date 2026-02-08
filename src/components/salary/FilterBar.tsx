"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { companySizeOptions } from "@/lib/validations";

type FilterBarProps = {
  role: string;
  location: string;
  searchParams: Record<string, string | string[] | undefined>;
};

export function FilterBar({ role, location, searchParams }: FilterBarProps) {
  const router = useRouter();
  const search = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(search.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v == null || v === "") next.delete(k);
        else next.set(k, v);
      });
      next.delete("page");
      router.push(`/${encodeURIComponent(role)}/${encodeURIComponent(location)}?${next.toString()}`);
    },
    [router, role, location, search]
  );

  const salaryMin = typeof searchParams.salaryMin === "string" ? searchParams.salaryMin : "";
  const salaryMax = typeof searchParams.salaryMax === "string" ? searchParams.salaryMax : "";
  const companySize = typeof searchParams.companySize === "string" ? searchParams.companySize : "";

  return (
    <div className="flex flex-wrap items-end gap-4 mt-6">
      <div>
        <label className="text-sm font-medium mb-1 block">Min salary</label>
        <Input
          type="number"
          placeholder="Min"
          value={salaryMin}
          onChange={(e) => updateParams({ salaryMin: e.target.value || null })}
          className="w-28"
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Max salary</label>
        <Input
          type="number"
          placeholder="Max"
          value={salaryMax}
          onChange={(e) => updateParams({ salaryMax: e.target.value || null })}
          className="w-28"
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Company size</label>
        <Select
          value={companySize || undefined}
          onValueChange={(v) => updateParams({ companySize: v || null })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            {companySizeOptions.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        variant="outline"
        onClick={() => router.push(`/${encodeURIComponent(role)}/${encodeURIComponent(location)}`)}
      >
        Clear
      </Button>
    </div>
  );
}
