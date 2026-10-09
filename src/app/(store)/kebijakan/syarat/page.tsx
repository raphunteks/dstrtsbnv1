import Link from "next/link";

export const metadata = {
  title: "Syarat & Ketentuan — Daster Tasbon Olshop",
  description: "Syarat dan ketentuan pembelian, aturan reservasi stok, dan tata cara transaksi di Daster Tasbon Olshop.",
};

export default function SyaratKetentuanPage() {
  return (
    <main className="mx-auto max-w-[var(--layout-readable)] px-4 py-12 md:px-6">
      <nav className="mb-6 text-caption text-muted">
        <Link href="/" className="hover:text-accent">
          ← Kembali ke Toko
        </Link>
      </nav>

      <h1 className="text-display font-bold text-ink">Syarat & Ketentuan</h1>
      <p className="mt-2 text-caption text-muted">Pembaruan Terakhir: 9 Oktober 2026</p>

      <div className="mt-8 space-y-6 text-body leading-relaxed text-ink">
        <section>
          <h2 className="text-h3 font-bold text-ink">1. Ketentuan Umum</h2>
          <p className="mt-2 text-small text-muted">
            Dengan melakukan pemesanan di Daster Tasbon Olshop, kamu dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang berlaku di bawah ini.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-bold text-ink">2. Harga & Snapshot Pesanan</h2>
          <p className="mt-2 text-small text-muted">
            Seluruh harga produk tertera dalam mata uang Rupiah (IDR) tanpa biaya tersembunyi. Saat pesanan dibuat dan dikonfirmasi, seluruh rincian harga, ongkos kirim, dan varian produk dibekukan (*snapshot order*). Perubahan harga katalog di masa mendatang tidak akan memengaruhi pesanan yang telah kamu selesaikan.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-bold text-ink">3. Reservasi Stok & Batas Waktu Pembayaran</h2>
          <p className="mt-2 text-small text-muted">
            Stok varian produk yang kamu pesan akan ditahan secara aman selama <strong>30 menit</strong> sejak pesanan dibuat. Jika pembayaran tidak diverifikasi sebelum batas waktu 30 menit berakhir, reservasi stok akan otomatis dilepaskan kembali ke etalase toko. Pembayaran yang masuk terlambat setelah hold lepas akan ditangani melalui prosedur kendala pembayaran atau pengembalian dana manual.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-bold text-ink">4. Pembayaran Sah</h2>
          <p className="mt-2 text-small text-muted">
            Pembayaran dianggap sah hanya jika telah diverifikasi secara langsung oleh sistem gateway Pakasir v2 melalui webhook terenkripsi di server kami. Bukti transfer atau tangkapan layar di luar sistem resmi tidak berlaku otomatis tanpa verifikasi manual tim finance.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-bold text-ink">5. Pengiriman & Tanggung Jawab Kurir</h2>
          <p className="mt-2 text-small text-muted">
            Keterlambatan pengiriman yang disebabkan oleh faktor eksternal pihak ekspedisi (bencana alam, kendala cuaca, atau alamat yang tidak lengkap/tidak dapat dihubungi) berada di luar kendali langsung kami, namun tim customer support kami akan senantiasa membantu proses pelacakan paket hingga sampai di tangan pembeli.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-bold text-ink">6. Hubungi Kami</h2>
          <p className="mt-2 text-small text-muted">
            Untuk informasi lebih lanjut mengenai ketentuan layanan ini, silakan hubungi tim kami melalui halaman{" "}
            <Link href="/bantuan" className="font-semibold text-accent underline">
              Pusat Bantuan
            </Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
