export function SalaryTableSkeleton() {
  return (
    <div className="space-y-3" aria-label="Loading salaries">
      <p className="text-sm text-slate-500 animate-pulse">Loading salaries...</p>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-16 rounded-xl bg-slate-100 animate-pulse"
          style={{ animationDelay: `${i * 100}ms` }}
        />
      ))}
    </div>
  );
}
