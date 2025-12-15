import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin@2025", 10);

  // ADMIN user
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password_hash: passwordHash,
      role: "OWNER",
      is_active: true
    }
  });

  // Raw materials
  await prisma.rawMaterial.createMany({
    data: [
      {
        rm_name: "Turmeric Whole",
        category: "Spice Whole",
        unit: "kg",
        min_stock_qty: 50,
        notes: "For turmeric powder"
      },
      {
        rm_name: "Red Chili Whole",
        category: "Spice Whole",
        unit: "kg",
        min_stock_qty: 30,
        notes: "For chili powder"
      },
      {
        rm_name: "Sesame Seeds",
        category: "Oil Seed",
        unit: "kg",
        min_stock_qty: 100,
        notes: "For cold-pressed sesame oil"
      }
    ],
    skipDuplicates: true
  });

  // Products
  await prisma.product.createMany({
    data: [
      {
        product_name: "Turmeric Powder 500g",
        category: "Spices",
        default_unit: "kg",
        hsn_code: "0910",
        shelf_life_days: 365
      },
      {
        product_name: "Red Chili Powder 500g",
        category: "Spices",
        default_unit: "kg",
        hsn_code: "0910",
        shelf_life_days: 365
      },
      {
        product_name: "Cold-Pressed Sesame Oil 1L",
        category: "Oils",
        default_unit: "L",
        hsn_code: "1515",
        shelf_life_days: 270
      }
    ],
    skipDuplicates: true
  });

  console.log("Seed data created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


