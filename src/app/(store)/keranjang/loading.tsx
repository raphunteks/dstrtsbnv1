export default function CartLoading() {
  return (
    <div className="mx-auto max-w-[var(--layout-checkout-max)] px-4 py-6 md:px-6 md:py-10 animate-pulse">
      <div className="h-9 w-40 rounded-card bg-paper-3 mb-6" />

      <div className="flex flex-col gap-6">
        <div className="rounded-card border border-rule bg-surface p-5 space-y-6">
          <div className="h-5 w-48 rounded-pill bg-paper-3" />

          <div className="flex gap-4 items-start border-t border-rule pt-4">
            <div className="size-20 rounded-card bg-paper-3 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-1/2 rounded-pill bg-paper-3" />
              <div className="h-4 w-1/4 rounded-pill bg-paper-3" />
              <div className="h-5 w-1/3 rounded-pill bg-paper-3" />
            </div>
            <div className="h-10 w-24 rounded-input bg-paper-3 shrink-0" />
          </div>

          <div className="border-t border-rule pt-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="h-4 w-16 rounded-pill bg-paper-3" />
              <div className="h-7 w-28 rounded-card bg-paper-3" />
            </div>
            <div className="h-11 w-44 rounded-pill bg-accent/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
