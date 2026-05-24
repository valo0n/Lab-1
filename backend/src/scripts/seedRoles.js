/* Seed per krejt rolet - krijoj nje user per cdo role */
import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Seed roles...");

  /* Sigurohu qe rolet ekzistojne - perdor 'name' jo 'emertimi' */
  const roles = ["Admin", "Manager", "Teknik", "Shites", "Klient"];
  for (const roleName of roles) {
    await prisma.roles.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName, pershkrimi: `Roli i ${roleName}` },
    });
    console.log(`✅ Role: ${roleName}`);
  }

  /* User-at qe duhet te krijohen */
  const users = [
    {
      user_name: "manager",
      email: "manager@paradox.com",
      emri_plote: "Manager Paradox",
      password: "Loni1234",
      role: "Manager",
    },
    {
      user_name: "teknik",
      email: "teknik@paradox.com",
      emri_plote: "Teknik Paradox",
      password: "Loni1234",
      role: "Teknik",
    },
    {
      user_name: "shites",
      email: "shites@paradox.com",
      emri_plote: "Shites Paradox",
      password: "Loni1234",
      role: "Shites",
    },
  ];

  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 10);

    let user = await prisma.users.findUnique({
      where: { email: u.email },
    });

    if (!user) {
      user = await prisma.users.create({
        data: {
          user_name: u.user_name,
          email: u.email,
          emri_plote: u.emri_plote,
          password_hash: passwordHash,
          email_confirmed: true,
          aktiv: true,
        },
      });
      console.log(`✅ User: ${u.email}`);
    } else {
      console.log(`⏭️  User ${u.email} ekziston`);
    }

    /* Lidh me role - perdor 'name' jo 'emertimi' */
    const role = await prisma.roles.findUnique({
      where: { name: u.role },
    });

    if (role) {
      const existing = await prisma.user_roles.findFirst({
        where: { user_id: user.id, role_id: role.id },
      });
      if (!existing) {
        await prisma.user_roles.create({
          data: { user_id: user.id, role_id: role.id },
        });
        console.log(`✅ ${u.email} -> Role ${u.role}`);
      }
    }
  }

  console.log("\n📋 Login credentials:");
  console.log("  admin@paradox.com   / Loni1234  (Admin)");
  console.log("  manager@paradox.com / Loni1234  (Manager)");
  console.log("  teknik@paradox.com  / Loni1234  (Teknik)");
  console.log("  shites@paradox.com  / Loni1234  (Shites)");
  console.log("\n✅ Seed roles complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
