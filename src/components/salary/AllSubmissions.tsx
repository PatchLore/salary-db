"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LatestSalariesTable } from "@/components/salary/LatestSalariesTable";
import { SalaryTableSkeleton } from "@/components/salary/SalaryTableSkeleton";

type Submission = {
  id: number;
  role: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  yearsExp: number;
  companySize: string;
};

type PaginationData = {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export function AllSubmissions({ initialPage = 1 }: { initialPage?: number }) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: initialPage,
    limit: 20,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/submissions?page=${pagination.page}&limit=${pagination.limit}`
        );
        if (!res.ok) throw new Error(`Failed to fetch submissions: ${res.status}`);
        const { data, pagination: paginationData } = await res.json();
        setSubmissions(data);
        setPagination(paginationData);
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setError(err instanceof Error ? err.message : "Failed to load submissions");
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubmissions();
  }, [pagination.page, pagination.limit]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading && submissions.length === 0) {
    return <SalaryTableSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pagination info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-sm text-slate-600">
          Showing{" "}
          <span className="font-semibold text-slate-900">
            {(pagination.page - 1) * pagination.limit + 1}
          </span>
          {" "}–{" "}
          <span className="font-semibold text-slate-900">
            {Math.min(pagination.page * pagination.limit, pagination.totalCount)}
          </span>
          {" "}of{" "}
          <span className="font-semibold text-slate-900">{pagination.totalCount}</span> salaries
        </div>
        <div className="text-sm text-slate-600">
          Page <span className="font-semibold text-slate-900">{pagination.page}</span> of{" "}
          <span className="font-semibold text-slate-900">{pagination.totalPages}</span>
        </div>
      </div>

      {/* Table */}
      <LatestSalariesTable submissions={submissions} />

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-xl border border-slate-200 p-4">
        <Button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={!pagination.hasPrevPage}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        {/* Page numbers */}
        <div className="flex gap-2 items-center justify-center flex-wrap">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
            .slice(
              Math.max(0, pagination.page - 3),
              Math.min(pagination.totalPages, pagination.page + 2)
            )
            .map((pageNum) => (
              <Button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                variant={pageNum === pagination.page ? "default" : "outline"}
                className={`min-w-[40px] ${
                  pageNum === pagination.page
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : ""
                }`}
              >
                {pageNum}
              </Button>
            ))}
        </div>

        <Button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={!pagination.hasNextPage}
          variant="outline"
          className="flex items-center gap-2"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
