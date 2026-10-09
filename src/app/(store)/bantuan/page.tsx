import Link from "next/link";

export const metadata = {
  title: "Pusat Bantuan & FAQ — Daster Tasbon Olshop",
  description: "Temukan jawaban seputar cara belanja, pengiriman, retur, ukuran, dan kebijakan Daster Tasbon Olshop.",
};

const helpCategories = [
  {
    title: "Cara Belanja",
    desc: "Panduan memilih varian daster, keranjang, hingga konfirmasi pembayaran otomatis.",
    href: "/bantuan/cara-belanja",
    icon: "🛍️",
  },
  {
    title: "Pengiriman & Ongkir",
    desc: "Tarif resmi RajaOngkir, estimasi waktu sampai, kurir yang didukung, dan jadwal kirim harian.",
    href: "/bantuan/pengiriman",
    icon: "🚚",
  },
  {
    title: "Retur & Refund",
    desc: "Garansi produk cacat atau salah kirim, syarat video unboxing, dan alur pengembalian dana.",
    href: "/bantuan/retur",
    icon: "🔄",
  },
  {
    title: "Panduan Ukuran & Bahan",
    desc: "Tabel lingkar dada (LD), panjang badan, dan tips merawat bahan katun rayon agar awet.",
    href: "/bantuan/panduan-ukuran",
    icon: "📐",
  },
  {
    title: "Lacak Status Pesanan",
    desc: "Cek posisi paket dan resi pengiriman tanpa harus login dengan nomor pesanan DTS.",
    href: "/pesanan/lacak",
    icon: "🔎",
  },
];

const faqs = [
  {
    q: "Apakah stok yang tertera di website selalu akurat?",
    a: "Ya. Setiap kamu memilih varian daster dan lanjut ke checkout, sistem kami menahan stok secara atomik selama 30 menit. Jika pembayaran diverifikasi sebelum 30 menit, barang dipastikan aman untukmu.",
  },
  {
    q: "Bagaimana cara melakukan pembayaran?",
    a: "Kami menggunakan gateway pembayaran resmi Pakasir v2. Kamu dapat membayar menggunakan QRIS (semua e-wallet & mobile banking) atau Virtual Account. Status pesanan akan terverifikasi otomatis dalam hitungan detik.",
  },
  {
    q: "Berapa lama pesanan saya dikirim?",
    a: "Pesanan ready stock yang dibayar sebelum pukul 14:00 WITA akan dikemas dan diserahkan ke kurir pada hari kerja yang sama. Pesanan setelah jam cut-off dikirim pada hari kerja berikutnya.",
  },
  {
    q: "Bagaimana jika pesanan yang diterima rusak atau tidak sesuai motif?",
    a: "Kami memberikan garansi 100%. Cukup sertakan video unboxing lengkap dan hubungi tim support kami dalam 2×24 jam sejak paket diterima untuk penggantian barang atau pengembalian dana.",
  },
];

export default function BantuanHubPage() {
  return (
    <main className="mx-auto max-w-[var(--layout-max)] px-4 py-12 md:px-6">
      <div className="text-center">
        <span className="text-caption font-bold tracking-wider text-accent uppercase">Bantuan & Informasi</span>
        <h1 className="mt-1 text-display font-bold text-ink">Ada yang Bisa Kami Bantu?</h1>
        <p className="mx-auto mt-3 max-w-[var(--layout-readable)] text-body text-muted">
          Pilih topik bantuan di bawah ini atau temukan jawaban langsung pada daftar pertanyaan umum seputar Daster Tasbon Olshop.
        </p>
      </div>

      {/* Grid Kategori Bantuan */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {helpCategories.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group flex flex-col rounded-card border border-rule bg-surface p-6 shadow-low transition-all hover:border-accent hover:shadow-medium"
          >
            <span className="text-3xl">{c.icon}</span>
            <h2 className="mt-4 text-h3 font-bold text-ink group-hover:text-accent">{c.title}</h2>
            <p className="mt-2 flex-1 text-small text-muted">{c.desc}</p>
            <span className="mt-4 text-small font-bold text-accent group-hover:underline">
              Baca panduan →
            </span>
          </Link>
        ))}
      </div>

      {/* Section FAQ Singkat */}
      <section className="mt-16 rounded-card border border-rule bg-surface p-6 md:p-10">
        <div className="text-center">
          <h2 className="text-h2 font-bold text-ink">Pertanyaan yang Sering Diajukan (FAQ)</h2>
          <p className="mt-1 text-small text-muted">Jawaban cepat untuk hal-hal yang sering ditanyakan pembeli.</p>
        </div>

        <div className="mt-8 divide-y divide-rule">
          {faqs.map((f, i) => (
            <div key={i} className="py-5">
              <h3 className="text-body font-bold text-ink">{f.q}</h3>
              <p className="mt-2 text-small leading-relaxed text-muted">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Banner Kontak */}
      <div className="mt-12 rounded-card border border-rule bg-paper-2 p-8 text-center">
        <h3 className="text-h3 font-bold text-ink">Belum Menemukan Jawaban?</h3>
        <p className="mt-2 text-small text-muted">
          Tim layanan pelanggan kami siap membantu kamu pada jam kerja (09:00 – 17:00 WITA).
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[var(--touch-target)] items-center justify-center rounded-input bg-accent px-6 py-2.5 text-button font-bold text-ink-inverse hover:bg-accent-hover"
          >
            Hubungi via WhatsApp
          </a>
          <Link
            href="/kebijakan/syarat"
            className="inline-flex min-h-[var(--touch-target)] items-center justify-center rounded-input border border-rule-strong bg-paper px-6 py-2.5 text-button font-semibold text-ink hover:bg-paper-2"
          >
            Lihat Syarat & Ketentuan
          </Link>
        </div>
      </div>
    </main>
  );
}
