export default function StoreLoading() {
  return (
    <div className="mx-auto max-w-[var(--layout-max)] px-4 py-8 md:px-6 animate-pulse space-y-8">
      {/* Header Banner Skeleton */}
      <div className="h-32 w-full rounded-card bg-paper-2" />

      {/* Grid Produk Skeleton */}
      <div className="grid grid-cols-1 gap-x-4 gap-y-8 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="aspect-[4/5] w-full rounded-card bg-paper-3 shadow-low" />
            <div className="h-5 w-3/4 rounded-pill bg-paper-3" />
            <div className="h-5 w-1/3 rounded-pill bg-paper-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
