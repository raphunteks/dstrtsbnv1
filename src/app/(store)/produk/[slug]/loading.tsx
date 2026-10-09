export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-[var(--layout-max)] px-4 py-6 md:px-6 md:py-10 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex gap-2 items-center">
        <div className="h-4 w-14 rounded-pill bg-paper-3" />
        <span className="text-muted">/</span>
        <div className="h-4 w-20 rounded-pill bg-paper-3" />
        <span className="text-muted">/</span>
        <div className="h-4 w-32 rounded-pill bg-paper-3" />
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
        {/* Foto Produk Skeleton (aspect 4:5) */}
        <div className="aspect-[4/5] w-full rounded-card bg-paper-3 shadow-low" />

        {/* Info & Pilihan Varian Skeleton */}
        <div className="flex flex-col gap-6">
          <div className="space-y-3">
            <div className="h-8 w-3/4 rounded-card bg-paper-3" />
            <div className="h-7 w-1/3 rounded-card bg-paper-3" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-16 rounded-pill bg-paper-3" />
            <div className="flex gap-2">
              <div className="h-10 w-20 rounded-input bg-paper-3" />
              <div className="h-10 w-20 rounded-input bg-paper-3" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-4 w-16 rounded-pill bg-paper-3" />
            <div className="flex gap-2">
              <div className="h-10 w-16 rounded-input bg-paper-3" />
              <div className="h-10 w-16 rounded-input bg-paper-3" />
            </div>
          </div>

          <div className="h-12 w-full rounded-pill bg-accent/20" />

          <div className="h-16 w-full rounded-card bg-paper-2" />
        </div>
      </div>
    </div>
  );
}
