import { Skeleton } from "@/components/ui/skeleton";

export default function OrderConfirmationLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-1 h-4 w-2/3" />

      <div className="border-border mt-8 divide-y rounded-lg border">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 p-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
        <div className="space-y-2 p-4">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
        </div>
        <div className="flex items-center justify-between p-4">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>

      <Skeleton className="mt-8 h-10 w-full" />
    </div>
  );
}
