export default function CheckoutLoading() {
  return (
    <div className="mx-auto max-w-[var(--layout-checkout-max)] px-4 py-6 md:px-6 md:py-10 animate-pulse">
      <div className="h-9 w-36 rounded-card bg-paper-3 mb-6" />

      <div className="grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
        {/* Kolom Form Kiri */}
        <div className="space-y-6">
          <div className="rounded-card border border-rule bg-surface p-6 space-y-4">
            <div className="h-6 w-40 rounded-pill bg-paper-3" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-11 rounded-input bg-paper-3" />
              <div className="h-11 rounded-input bg-paper-3" />
            </div>
            <div className="h-11 rounded-input bg-paper-3" />
          </div>

          <div className="rounded-card border border-rule bg-surface p-6 space-y-4">
            <div className="h-6 w-48 rounded-pill bg-paper-3" />
            <div className="h-11 rounded-input bg-paper-3" />
            <div className="h-20 rounded-input bg-paper-3" />
          </div>
        </div>

        {/* Kolom Ringkasan Kanan */}
        <aside className="rounded-card border border-rule bg-paper-2 p-5 space-y-4">
          <div className="h-6 w-32 rounded-pill bg-paper-3" />
          <div className="space-y-3 pt-2">
            <div className="flex justify-between">
              <div className="h-4 w-28 rounded-pill bg-paper-3" />
              <div className="h-4 w-20 rounded-pill bg-paper-3" />
            </div>
            <div className="flex justify-between">
              <div className="h-4 w-20 rounded-pill bg-paper-3" />
              <div className="h-4 w-16 rounded-pill bg-paper-3" />
            </div>
          </div>
          <div className="border-t border-rule pt-4">
            <div className="h-12 w-full rounded-pill bg-accent/20" />
          </div>
        </aside>
      </div>
    </div>
  );
}
