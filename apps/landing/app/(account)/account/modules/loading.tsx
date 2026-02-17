import { Skeleton } from "@zunftgewerk/ui";

export default function ModulesLoading() {
  return (
    <>
      <div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>
      <Skeleton className="h-10 w-96" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-xl" />
        ))}
      </div>
    </>
  );
}
