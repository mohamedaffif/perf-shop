import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN", passwordHash },
    create: {
      email,
      name: "Admin",
      role: "ADMIN",
      passwordHash,
    },
  });

  console.log(`Seeded admin user: ${admin.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
