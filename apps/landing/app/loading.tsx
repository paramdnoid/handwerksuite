export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="bg-primary/20 h-10 w-10 animate-pulse rounded-xl" />
        <div className="bg-muted h-2 w-24 animate-pulse rounded-full" />
      </div>
    </div>
  )
}
