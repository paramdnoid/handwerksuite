import { Skeleton } from "@zunftgewerk/ui";

export default function CompanyLoading() {
  return (
    <>
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-64 rounded-xl" />
      ))}
    </>
  );
}
