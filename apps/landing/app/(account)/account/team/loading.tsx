import { Skeleton } from "@zunftgewerk/ui";

export default function TeamLoading() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-44" />
      </div>
      <Skeleton className="h-80 rounded-xl" />
    </>
  );
}
