/* Script per te krijuar/perditesuar adminin fillestar */
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";

async function seedAdmin() {
  const email = "admin@admin.com";
  const password = "Loni1234";
  const user_name = "admin";

  console.log("🔧 Duke konfiguruar admin user...");

  /* Kontrollo nese ekziston me email OSE me user_name */
  const existing = await prisma.users.findFirst({
    where: {
      OR: [{ email }, { user_name }],
    },
    include: { user_roles: { include: { roles: true } } },
  });

  const password_hash = await bcrypt.hash(password, 10);

  if (existing) {
    /* Ekziston — perditeso passwordin dhe sigurohu qe ka rolin Admin */
    console.log("⚠️  Admin ekziston tashme, duke perditesuar passwordin...");

    await prisma.$transaction(async (tx) => {
      /* Perditeso passwordin */
      await tx.users.update({
        where: { id: existing.id },
        data: { password_hash, aktiv: true, email_confirmed: true },
      });

      /* Kontrollo nese ka rolin Admin */
      const hasAdminRole = existing.user_roles.some(
        (ur) => ur.roles.name === "Admin",
      );

      if (!hasAdminRole) {
        const adminRole = await tx.roles.findUnique({
          where: { name: "Admin" },
        });
        if (adminRole) {
          await tx.user_roles.create({
            data: { user_id: existing.id, role_id: adminRole.id },
          });
          console.log("✅ Roli Admin u shtua");
        }
      }
    });

    console.log(`✅ Admin u perditesua: ${email} / ${password}`);
  } else {
    /* Nuk ekziston — krijoje */
    await prisma.$transaction(async (tx) => {
      const admin = await tx.users.create({
        data: {
          user_name,
          email,
          password_hash,
          emri_plote: "Admin Paradox",
          email_confirmed: true,
        },
      });

      const adminRole = await tx.roles.findUnique({ where: { name: "Admin" } });
      if (adminRole) {
        await tx.user_roles.create({
          data: { user_id: admin.id, role_id: adminRole.id },
        });
      }
    });

    console.log(`✅ Admin u krijua: ${email} / ${password}`);
  }

  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
