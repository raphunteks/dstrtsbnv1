import Link from "next/link";

export const metadata = {
  title: "Informasi Pengiriman — Daster Tasbon Olshop",
  description: "Ketentuan pengiriman, ekspedisi kurir RajaOngkir, estimasi waktu, dan jadwal pemrosesan paket.",
};

export default function PengirimanPage() {
  return (
    <main className="mx-auto max-w-[var(--layout-readable)] px-4 py-12 md:px-6">
      <nav className="mb-6 text-caption text-muted">
        <Link href="/bantuan" className="hover:text-accent">
          ← Kembali ke Pusat Bantuan
        </Link>
      </nav>

      <h1 className="text-display font-bold text-ink">Informasi Pengiriman</h1>
      <p className="mt-2 text-body text-muted">
        Kami melayani pengiriman ke seluruh wilayah Indonesia dengan ekspedisi resmi terpercaya.
      </p>

      <div className="mt-8 space-y-6 text-body leading-relaxed text-ink">
        <section className="rounded-card border border-rule bg-surface p-6">
          <h2 className="text-h3 font-bold text-ink">1. Ekspedisi & Perhitungan Ongkos Kirim</h2>
          <p className="mt-2 text-small text-muted">
            Tarif pengiriman dihitung secara otomatis dan transparan di server kami menggunakan kalkulasi resmi <strong>RajaOngkir Shipping Cost</strong> berdasarkan berat paket (gram) dan kecamatan tujuan pengiriman. Kami mendukung berbagai kurir ternama seperti J&T Express, JNE, SiCepat, dan POS Indonesia.
          </p>
        </section>

        <section className="rounded-card border border-rule bg-surface p-6">
          <h2 className="text-h3 font-bold text-ink">2. Jam Operasional & Batas Pembayaran (Cut-off)</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-small text-muted">
            <li>
              <strong>Senin – Sabtu:</strong> Pembayaran yang diverifikasi sebelum pukul <strong>14:00 WITA</strong> akan diproses dan diserahkan ke kurir pada hari yang sama.
            </li>
            <li>
              Pembayaran yang masuk setelah pukul 14:00 WITA atau pada hari Minggu/Hari Libur Nasional akan diproses pada hari kerja berikutnya.
            </li>
          </ul>
        </section>

        <section className="rounded-card border border-rule bg-surface p-6">
          <h2 className="text-h3 font-bold text-ink">3. Estimasi Waktu Sampai (ETA)</h2>
          <p className="mt-2 text-small text-muted">
            Estimasi waktu tiba paket bergantung pada wilayah tujuan dan layanan kurir yang dipilih:
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-small">
              <thead>
                <tr className="border-b border-rule font-bold text-ink">
                  <th className="py-2">Jangkauan Wilayah</th>
                  <th className="py-2">Estimasi Pengiriman</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule text-muted">
                <tr>
                  <td className="py-2">Kota Makassar & Sekitarnya</td>
                  <td className="py-2">1 – 2 hari kerja</td>
                </tr>
                <tr>
                  <td className="py-2">Sulawesi Selatan & Barat</td>
                  <td className="py-2">2 – 3 hari kerja</td>
                </tr>
                <tr>
                  <td className="py-2">Pulau Jawa, Bali, Sumatera, Kalimantan</td>
                  <td className="py-2">3 – 5 hari kerja</td>
                </tr>
                <tr>
                  <td className="py-2">Maluku, Papua & Daerah Pelosok</td>
                  <td className="py-2">5 – 8 hari kerja</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-caption text-muted">
            *Catatan: Estimasi waktu adalah perkiraan operasional ekspedisi dan dapat dipengaruhi oleh kondisi cuaca atau lonjakan pengiriman hari raya.
          </p>
        </section>

        <section className="rounded-card border border-rule bg-surface p-6">
          <h2 className="text-h3 font-bold text-ink">4. Pelacakan Nomor Resi</h2>
          <p className="mt-2 text-small text-muted">
            Setelah paket diserahkan ke pihak ekspedisi, nomor resi (AWB) resmi akan langsung dicatat pada rincian pesananmu. Kamu dapat melacak progres pengiriman kapan saja melalui menu{" "}
            <Link href="/pesanan/lacak" className="font-semibold text-accent underline">
              Lacak Pesanan
            </Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
