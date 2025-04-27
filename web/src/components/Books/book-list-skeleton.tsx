import { Skeleton } from "../ui/skeleton";

export default function BookListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border rounded-md">
          <Skeleton className="h-24 w-16 rounded" />
          <div className="flex-1 space-y-2">
            {" "}
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between pt-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
