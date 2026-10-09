import Link from "next/link";

export const metadata = {
  title: "Cara Belanja — Daster Tasbon Olshop",
  description: "Langkah mudah berbelanja daster berkualitas di Daster Tasbon Olshop dari pemilihan ukuran hingga pembayaran.",
};

export default function CaraBelanjaPage() {
  const steps = [
    {
      num: "01",
      title: "Pilih Model & Ukuran",
      desc: "Jelajahi katalog kami. Periksa deskripsi bahan, lingkar dada (LD), dan panjang badan. Pilih warna dan ukuran yang kamu inginkan, lalu klik 'Tambah ke Keranjang'.",
    },
    {
      num: "02",
      title: "Periksa Keranjang Belanja",
      desc: "Buka menu Keranjang di pojok kanan atas. Pastikan varian dan jumlah sudah sesuai. Masukkan kode promo kupon jika kamu memilikinya untuk mendapatkan potongan harga.",
    },
    {
      num: "03",
      title: "Isi Alamat & Pilih Kurir",
      desc: "Lanjutkan ke Checkout. Masukkan nama penerima, nomor WhatsApp aktif, dan alamat lengkap kecamatan. Sistem otomatis menghitung tarif ongkir resmi RajaOngkir.",
    },
    {
      num: "04",
      title: "Lakukan Pembayaran Aman",
      desc: "Pilih metode pembayaran (QRIS atau Virtual Account via Pakasir v2). Selesaikan pembayaran dalam 30 menit selama stok kamu direservasi.",
    },
    {
      num: "05",
      title: "Pantau & Terima Paket",
      desc: "Setelah pembayaran terkonfirmasi, kami akan mengemas pesananmu dengan rapi. Kamu dapat melacak nomor resi kurir langsung dari halaman pesanan.",
    },
  ];

  return (
    <main className="mx-auto max-w-[var(--layout-readable)] px-4 py-12 md:px-6">
      <nav className="mb-6 text-caption text-muted">
        <Link href="/bantuan" className="hover:text-accent">
          ← Kembali ke Pusat Bantuan
        </Link>
      </nav>

      <h1 className="text-display font-bold text-ink">Panduan Cara Belanja</h1>
      <p className="mt-2 text-body text-muted">
        Belanja mudah, aman, dan tanpa biaya tersembunyi di Daster Tasbon Olshop.
      </p>

      <div className="mt-10 space-y-8">
        {steps.map((s) => (
          <div key={s.num} className="flex gap-5 rounded-card border border-rule bg-surface p-6 shadow-low">
            <span className="text-2xl font-black text-accent">{s.num}</span>
            <div>
              <h2 className="text-h3 font-bold text-ink">{s.title}</h2>
              <p className="mt-2 text-small leading-relaxed text-muted">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-card border border-rule bg-paper-2 p-6 text-center">
        <h3 className="text-h3 font-bold text-ink">Sudah siap memilih daster favoritmu?</h3>
        <div className="mt-4">
          <Link
            href="/"
            className="inline-flex min-h-[var(--touch-target)] items-center justify-center rounded-input bg-accent px-6 py-2.5 text-button font-bold text-ink-inverse hover:bg-accent-hover"
          >
            Mulai Belanja Sekarang
          </Link>
        </div>
      </div>
    </main>
  );
}
