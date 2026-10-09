import Link from "next/link";

export const metadata = {
  title: "Kebijakan Privasi — Daster Tasbon Olshop",
  description: "Kebijakan pelindungan data pribadi pembeli di Daster Tasbon Olshop sesuai UU Pelindungan Data Pribadi.",
};

export default function KebijakanPrivasiPage() {
  return (
    <main className="mx-auto max-w-[var(--layout-readable)] px-4 py-12 md:px-6">
      <nav className="mb-6 text-caption text-muted">
        <Link href="/" className="hover:text-accent">
          ← Kembali ke Toko
        </Link>
      </nav>

      <h1 className="text-display font-bold text-ink">Kebijakan Privasi</h1>
      <p className="mt-2 text-caption text-muted">Pembaruan Terakhir: 9 Oktober 2026</p>

      <div className="mt-8 space-y-6 text-body leading-relaxed text-ink">
        <section>
          <h2 className="text-h3 font-bold text-ink">1. Komitmen Perlindungan Privasi</h2>
          <p className="mt-2 text-small text-muted">
            Daster Tasbon Olshop menghargai dan melindungi setiap data pribadi yang kamu berikan kepada kami. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan menjaga kerahasiaan informasi kamu saat mengakses situs web kami.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-bold text-ink">2. Data yang Kami Kumpulkan</h2>
          <p className="mt-2 text-small text-muted">Kami hanya mengumpulkan data yang diperlukan untuk memproses transaksi belanja kamu:</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-small text-muted">
            <li><strong>Data Transaksi & Pengiriman:</strong> Nama penerima, alamat jalan, kecamatan, kota, provinsi, kode pos, dan nomor telepon aktif untuk kurir pengantar.</li>
            <li><strong>Data Akun (Jika Mendaftar):</strong> Alamat email, nama tampilan, dan riwayat pesanan.</li>
            <li><strong>Data Pembayaran:</strong> Kami tidak pernah menyimpan nomor kartu atau kredensial rahasia perbankan. Seluruh proses pembayaran difasilitasi oleh gateway resmi Pakasir v2 yang berizin Bank Indonesia.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-h3 font-bold text-ink">3. Penggunaan Informasi</h2>
          <p className="mt-2 text-small text-muted">Informasi kamu digunakan semata-mata untuk:</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-small text-muted">
            <li>Memverifikasi pesanan dan menghitung ongkos kirim melalui layanan RajaOngkir.</li>
            <li>Mengirimkan paket pesanan melalui kurir ekspedisi ke alamat tujuan.</li>
            <li>Memberikan pembaruan status pesanan dan nomor resi pengiriman.</li>
            <li>Mengirimkan informasi promosi hanya jika kamu secara sukarela memberikan persetujuan (opt-in) terpisah.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-h3 font-bold text-ink">4. Hak Pengguna atas Data (UU PDP)</h2>
          <p className="mt-2 text-small text-muted">
            Sesuai peraturan perundang-undangan, kamu berhak meminta akses, perbaikan, atau penghapusan data pribadimu yang tersimpan di sistem kami. Riwayat transaksi finansial yang wajib disimpan untuk kepatuhan perpajakan akan diarsipkan secara aman sesuai batas waktu hukum yang berlaku.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-bold text-ink">5. Kontak Tim Privasi</h2>
          <p className="mt-2 text-small text-muted">
            Jika kamu memiliki pertanyaan seputar kebijakan privasi ini atau ingin mengajukan penghapusan akun, silakan hubungi kami melalui email: <span className="font-semibold text-ink">support@dastertasbon.com</span>.
          </p>
        </section>
      </div>
    </main>
  );
}
