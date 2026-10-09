import Link from "next/link";

export const metadata = {
  title: "Kebijakan Retur & Refund — Daster Tasbon Olshop",
  description: "Ketentuan garansi, syarat komplain produk cacat/salah kirim, dan prosedur pengembalian dana pembeli.",
};

export default function ReturRefundPage() {
  return (
    <main className="mx-auto max-w-[var(--layout-readable)] px-4 py-12 md:px-6">
      <nav className="mb-6 text-caption text-muted">
        <Link href="/bantuan" className="hover:text-accent">
          ← Kembali ke Pusat Bantuan
        </Link>
      </nav>

      <h1 className="text-display font-bold text-ink">Kebijakan Retur & Refund</h1>
      <p className="mt-2 text-body text-muted">
        Kepuasan dan kenyamanan kamu berbelanja di Daster Tasbon Olshop adalah prioritas utama kami.
      </p>

      <div className="mt-8 space-y-6 text-body leading-relaxed text-ink">
        <section className="rounded-card border border-rule bg-surface p-6">
          <h2 className="text-h3 font-bold text-ink">1. Garansi Produk</h2>
          <p className="mt-2 text-small text-muted">
            Kami memberikan garansi penukaran barang atau pengembalian dana penuh (100%) apabila:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-small text-muted">
            <li>Produk yang kamu terima mengalami cacat produksi (robek parah, jahitan lepas fatal).</li>
            <li>Produk yang dikirimkan tidak sesuai dengan pesanan (salah motif, salah model, atau salah ukuran signifikan).</li>
            <li>Terdapat barang yang kurang di dalam paket pengiriman.</li>
          </ul>
        </section>

        <section className="rounded-card border border-rule bg-surface p-6">
          <h2 className="text-h3 font-bold text-ink">2. Syarat Pengajuan Komplain</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-small text-muted">
            <li>
              <strong>Video Unboxing Lengkap:</strong> Wajib menyertakan video unboxing mulai dari paket masih tersegel rapi hingga diperiksa tanpa jeda (cut/pause).
            </li>
            <li>
              <strong>Batas Waktu:</strong> Komplain diajukan maksimal <strong>2×24 jam</strong> sejak paket dinyatakan diterima oleh kurir.
            </li>
            <li>
              <strong>Kondisi Produk:</strong> Produk belum pernah dicuci, belum dipakai, tidak berbau parfum/detergen, dan tag/label masih utuh.
            </li>
          </ul>
        </section>

        <section className="rounded-card border border-rule bg-surface p-6">
          <h2 className="text-h3 font-bold text-ink">3. Prosedur Pengembalian Dana (Refund)</h2>
          <p className="mt-2 text-small text-muted">
            Sesuai kebijakan keuangan teraudit kami:
          </p>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-small text-muted">
            <li>Tim Customer Support akan memverifikasi bukti video unboxing dan nomor pesanan DTS kamu.</li>
            <li>Jika disetujui, kamu akan diberikan instruksi pengiriman balik paket ke gudang kami (ongkir retur ditanggung oleh toko untuk kesalahan dari pihak kami).</li>
            <li>Setelah paket retur tiba dan lolos inspeksi fisik, bagian Finance akan memproses transfer pengembalian dana manual ke rekening bank kamu dalam 1–2 hari kerja, disertai bukti transfer sah.</li>
          </ol>
        </section>

        <section className="rounded-card border border-rule bg-paper-2 p-6">
          <h2 className="text-h3 font-bold text-ink">Cara Menghubungi Tim Support</h2>
          <p className="mt-2 text-small text-muted">
            Untuk memulai pengajuan retur, siapkan nomor pesananmu dan video unboxing, lalu hubungi layanan WhatsApp resmi kami.
          </p>
          <div className="mt-4">
            <a
              href="https://wa.me/6281234567890?text=Halo%20Admin%20Daster%20Tasbon,%20saya%20ingin%20mengajukan%20komplain%20pesanan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[var(--touch-target)] items-center justify-center rounded-input bg-accent px-6 py-2.5 text-button font-bold text-ink-inverse hover:bg-accent-hover"
            >
              Ajukan Komplain via WhatsApp
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
