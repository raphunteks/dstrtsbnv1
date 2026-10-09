import Link from "next/link";

export const metadata = {
  title: "Panduan Ukuran & Perawatan Bahan — Daster Tasbon Olshop",
  description: "Tabel ukuran lingkar dada daster wanita dan panduan merawat kain rayon viscose agar lembut dan awet.",
};

export default function PanduanUkuranPage() {
  return (
    <main className="mx-auto max-w-[var(--layout-readable)] px-4 py-12 md:px-6">
      <nav className="mb-6 text-caption text-muted">
        <Link href="/bantuan" className="hover:text-accent">
          ← Kembali ke Pusat Bantuan
        </Link>
      </nav>

      <h1 className="text-display font-bold text-ink">Panduan Ukuran & Perawatan Bahan</h1>
      <p className="mt-2 text-body text-muted">
        Pastikan kamu memilih ukuran yang paling nyaman untuk beraktivitas santai di rumah.
      </p>

      {/* Tabel Ukuran Standar */}
      <section className="mt-8 rounded-card border border-rule bg-surface p-6 shadow-low">
        <h2 className="text-h3 font-bold text-ink">Tabel Standar Ukuran Daster</h2>
        <p className="mt-1 text-small text-muted">
          Daster kami umumnya dirancang dengan potongan longgar (*loose fit*) untuk kenyamanan maksimal sehari-hari.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-small">
            <thead>
              <tr className="border-b border-rule font-bold text-ink">
                <th className="py-2.5">Ukuran</th>
                <th className="py-2.5">Lingkar Dada (LD)</th>
                <th className="py-2.5">Panjang Baju (PB)</th>
                <th className="py-2.5">Perkiraan Berat Badan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule text-muted">
              <tr>
                <td className="py-2.5 font-bold text-ink">All Size Standard</td>
                <td className="py-2.5">105 – 110 cm</td>
                <td className="py-2.5">110 – 115 cm</td>
                <td className="py-2.5">45 – 70 kg</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-ink">Jumbo (XL / XXL)</td>
                <td className="py-2.5">120 – 125 cm</td>
                <td className="py-2.5">115 – 120 cm</td>
                <td className="py-2.5">70 – 90 kg</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-ink">Super Jumbo (XXXL)</td>
                <td className="py-2.5">130 – 140 cm</td>
                <td className="py-2.5">120 – 125 cm</td>
                <td className="py-2.5">90 – 115 kg</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-ink">Midi / Semata Kaki</td>
                <td className="py-2.5">110 cm</td>
                <td className="py-2.5">95 – 100 cm</td>
                <td className="py-2.5">45 – 75 kg</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-caption text-muted">
          *Toleransi ukuran jahitan berkisar 1–2 cm karena proses pemotongan manual.
        </p>
      </section>

      {/* Karakteristik Bahan */}
      <section className="mt-8 rounded-card border border-rule bg-surface p-6 shadow-low">
        <h2 className="text-h3 font-bold text-ink">Karakteristik Bahan Katun Rayon Viscose</h2>
        <div className="mt-3 space-y-3 text-small leading-relaxed text-muted">
          <p>
            Koleksi daster kami mayoritas menggunakan kain <strong>Rayon Viscose Premium</strong>. Karakteristik utamanya:
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li><strong>Sangat Sejuk & Dingin:</strong> Serat selulosa alami memungkinkan sirkulasi udara yang sangat baik di cuaca tropis.</li>
            <li><strong>Jatuh & Lembut:</strong> Mengikuti lekuk tubuh dengan luwes tanpa terasa kaku.</li>
            <li><strong>Daya Serap Tinggi:</strong> Cepat menyerap keringat dan tidak menyebabkan rasa gerah saat tidur atau beres-beres rumah.</li>
          </ul>
        </div>
      </section>

      {/* Tips Perawatan */}
      <section className="mt-8 rounded-card border border-rule bg-surface p-6 shadow-low">
        <h2 className="text-h3 font-bold text-ink">Tips Merawat Daster Rayon Agar Tahan Lama</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-small leading-relaxed text-muted">
          <li><strong>Pencucian Pertama:</strong> Cuci secara terpisah pada pencucian pertama untuk melepaskan sisa residu pewarnaan pabrik alami tanpa merusak warna utama.</li>
          <li><strong>Gunakan Air Suhu Ruangan:</strong> Hindari mencuci dengan air panas karena dapat menyebabkan serat rayon menyusut.</li>
          <li><strong>Hindari Perasan Terlalu Kuat:</strong> Cukup peras ringan. Sebaiknya hindari pengering mesin putaran tinggi (*tumble dry*).</li>
          <li><strong>Jemur di Tempat Teduh:</strong> Balik pakaian saat menjemur (bagian dalam di luar) dan jemur di area yang berangin tanpa terkena sinar matahari terik langsung agar warna tidak mudah pudar.</li>
          <li><strong>Setrika Suhu Sedang:</strong> Setrika dengan suhu katun sedang untuk mengembalikan kelembutan kain.</li>
        </ol>
      </section>

      <div className="mt-10 text-center">
        <Link
          href="/"
          className="inline-flex min-h-[var(--touch-target)] items-center justify-center rounded-input bg-accent px-6 py-2.5 text-button font-bold text-ink-inverse hover:bg-accent-hover"
        >
          Lihat Koleksi Daster Terbaru
        </Link>
      </div>
    </main>
  );
}
