import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Skeleton className="mb-6 h-4 w-48" />

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
        <div className="flex flex-col gap-3 lg:w-1/2">
          <Skeleton className="rounded-image aspect-4/3 w-full" />
          <div className="flex gap-2">
            <Skeleton className="rounded-image size-16 sm:size-20" />
            <Skeleton className="rounded-image size-16 sm:size-20" />
            <Skeleton className="rounded-image size-16 sm:size-20" />
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:w-1/2">
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-px w-full" />
          <div className="grid grid-cols-3 gap-2">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </div>
  );
}
