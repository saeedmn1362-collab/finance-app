import { Skeleton } from "@/components/ui/Skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <Skeleton className="h-12 w-48" />

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>

      {/* Chart / Table */}
      <Skeleton className="h-72 w-full" />
    </div>
  );
}