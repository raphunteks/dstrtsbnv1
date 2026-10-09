import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const email = process.argv[2] || "admin@dastertasbon.com";
  const password = process.argv[3] || "Admin123!456";

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Error: SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY tidak ditemukan di .env");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  console.log(`Membuat/memperbarui akun admin: ${email}...`);

  // 1. Cek apakah user sudah ada di Supabase Auth
  const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("Gagal membaca daftar pengguna Supabase:", listError.message);
    process.exit(1);
  }

  const existing = listData.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  let userId = existing?.id;

  if (existing) {
    console.log(`Pengguna dengan email ${email} sudah terdaftar di Supabase Auth (ID: ${userId}).`);
    // Update password jika diberikan
    const { error: updateError } = await supabase.auth.admin.updateUserById(userId!, {
      password,
      email_confirm: true,
    });
    if (updateError) {
      console.warn("Peringatan saat memperbarui kata sandi:", updateError.message);
    } else {
      console.log("Kata sandi berhasil diperbarui.");
    }
  } else {
    // Buat pengguna baru di Supabase Auth
    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError || !createData.user) {
      console.error("Gagal membuat user di Supabase Auth:", createError?.message);
      process.exit(1);
    }

    userId = createData.user.id;
    console.log(`User Supabase Auth berhasil dibuat (ID: ${userId}).`);
  }

  if (!userId) {
    console.error("Gagal mendapatkan User ID.");
    process.exit(1);
  }

  // 2. Sinkronkan ke PostgreSQL (schema app.User)
  await db.user.upsert({
    where: { id: userId },
    create: {
      id: userId,
      email,
      status: "active",
      emailVerifiedAt: new Date(),
    },
    update: {
      email,
      status: "active",
      emailVerifiedAt: new Date(),
    },
  });

  // 3. Berikan hak akses super_admin di app.StaffRole
  await db.staffRole.upsert({
    where: {
      userId_role: {
        userId: userId!,
        role: "super_admin",
      },
    },
    create: {
      userId: userId!,
      role: "super_admin",
    },
    update: {},
  });

  console.log("--------------------------------------------------");
  console.log("✅ AKUN SUPER ADMIN BERHASIL DIBUAT/DIKONFIGURASI!");
  console.log(`Email       : ${email}`);
  console.log(`Kata Sandi  : ${password}`);
  console.log(`Role        : super_admin`);
  console.log("--------------------------------------------------");
}

main()
  .catch((err) => {
    console.error("Gagal menjalankan script create-admin:", err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
