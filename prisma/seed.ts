import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function seedAdmin() {
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

const BRANDS = [
  { name: "Maison Étoile", slug: "maison-etoile" },
  { name: "Velour & Co", slug: "velour-co" },
  { name: "Noir Atelier", slug: "noir-atelier" },
  { name: "Aurelia House", slug: "aurelia-house" },
] as const;

const CATEGORIES = [
  { name: "Women's Fragrance", slug: "womens-fragrance" },
  { name: "Men's Fragrance", slug: "mens-fragrance" },
  { name: "Unisex Fragrance", slug: "unisex-fragrance" },
] as const;

const PRODUCTS = [
  {
    name: "Oud Noir",
    brandSlug: "maison-etoile",
    categorySlug: "mens-fragrance",
    concentration: "EXTRAIT_DE_PARFUM",
    size: "ML_50",
    price: 62500,
    badges: ["BEST_SELLER", "LIMITED_EDITION"],
    topNotes: ["Saffron", "Bergamot"],
    heartNotes: ["Oud", "Rose"],
    baseNotes: ["Amber", "Sandalwood"],
  },
  {
    name: "Velvet Rose",
    brandSlug: "velour-co",
    categorySlug: "womens-fragrance",
    concentration: "EAU_DE_PARFUM",
    size: "ML_75",
    price: 54500,
    badges: ["NEW"],
    topNotes: ["Pink Pepper", "Bergamot"],
    heartNotes: ["Rose", "Peony"],
    baseNotes: ["Musk", "Vanilla"],
  },
  {
    name: "Citrus Breeze",
    brandSlug: "noir-atelier",
    categorySlug: "unisex-fragrance",
    concentration: "EAU_DE_COLOGNE",
    size: "ML_100",
    price: 41500,
    badges: [],
    topNotes: ["Lemon", "Bergamot"],
    heartNotes: ["Neroli", "Green Tea"],
    baseNotes: ["White Musk"],
  },
  {
    name: "Golden Amber",
    brandSlug: "aurelia-house",
    categorySlug: "womens-fragrance",
    concentration: "EAU_DE_TOILETTE",
    size: "ML_50",
    price: 47000,
    badges: ["SALE"],
    topNotes: ["Mandarin"],
    heartNotes: ["Amber", "Jasmine"],
    baseNotes: ["Vanilla", "Tonka Bean"],
  },
  {
    name: "Cedar & Smoke",
    brandSlug: "maison-etoile",
    categorySlug: "mens-fragrance",
    concentration: "EAU_DE_PARFUM",
    size: "ML_75",
    price: 58500,
    badges: ["BEST_SELLER"],
    topNotes: ["Black Pepper"],
    heartNotes: ["Cedarwood", "Incense"],
    baseNotes: ["Leather", "Vetiver"],
  },
  {
    name: "Fresh Linen",
    brandSlug: "velour-co",
    categorySlug: "unisex-fragrance",
    concentration: "EAU_FRAICHE",
    size: "ML_100",
    price: 36000,
    badges: ["NEW", "SALE"],
    topNotes: ["Aquatic Accord", "Citrus"],
    heartNotes: ["Lily of the Valley"],
    baseNotes: ["Musk"],
  },
  {
    name: "Midnight Iris",
    brandSlug: "noir-atelier",
    categorySlug: "womens-fragrance",
    concentration: "EXTRAIT_DE_PARFUM",
    size: "ML_50",
    price: 64000,
    badges: ["LIMITED_EDITION"],
    topNotes: ["Iris"],
    heartNotes: ["Violet", "Plum"],
    baseNotes: ["Patchouli", "Vanilla"],
  },
  {
    name: "Silver Vetiver",
    brandSlug: "aurelia-house",
    categorySlug: "mens-fragrance",
    concentration: "EAU_DE_PARFUM",
    size: "ML_75",
    price: 53000,
    badges: [],
    topNotes: ["Grapefruit"],
    heartNotes: ["Vetiver", "Geranium"],
    baseNotes: ["Oakmoss", "Cedar"],
  },
  {
    name: "Sunlit Neroli",
    brandSlug: "maison-etoile",
    categorySlug: "unisex-fragrance",
    concentration: "EAU_DE_TOILETTE",
    size: "ML_100",
    price: 45000,
    badges: ["NEW"],
    topNotes: ["Neroli", "Orange Blossom"],
    heartNotes: ["Jasmine"],
    baseNotes: ["White Musk"],
  },
  {
    name: "Bergamot Noir",
    brandSlug: "velour-co",
    categorySlug: "mens-fragrance",
    concentration: "EAU_DE_COLOGNE",
    size: "ML_50",
    price: 37500,
    badges: ["SALE"],
    topNotes: ["Bergamot", "Mint"],
    heartNotes: ["Lavender"],
    baseNotes: ["Tonka Bean"],
  },
  {
    name: "Wild Jasmine",
    brandSlug: "noir-atelier",
    categorySlug: "womens-fragrance",
    concentration: "EAU_FRAICHE",
    size: "ML_75",
    price: 34000,
    badges: [],
    topNotes: ["Green Leaves"],
    heartNotes: ["Jasmine", "Tuberose"],
    baseNotes: ["Musk"],
  },
  {
    name: "Smoked Vanilla",
    brandSlug: "aurelia-house",
    categorySlug: "unisex-fragrance",
    concentration: "EXTRAIT_DE_PARFUM",
    size: "ML_100",
    price: 66000,
    badges: ["BEST_SELLER", "SALE"],
    topNotes: ["Cinnamon"],
    heartNotes: ["Vanilla", "Tobacco"],
    baseNotes: ["Amber", "Benzoin"],
  },
  {
    name: "Royal Sandalwood",
    brandSlug: "maison-etoile",
    categorySlug: "mens-fragrance",
    concentration: "EAU_DE_PARFUM",
    size: "ML_50",
    price: 60500,
    badges: ["LIMITED_EDITION"],
    topNotes: ["Cardamom"],
    heartNotes: ["Sandalwood", "Rose"],
    baseNotes: ["Musk", "Amber"],
  },
  {
    name: "Peony Blush",
    brandSlug: "velour-co",
    categorySlug: "womens-fragrance",
    concentration: "EAU_DE_TOILETTE",
    size: "ML_75",
    price: 43500,
    badges: ["NEW"],
    topNotes: ["Peony", "Litchi"],
    heartNotes: ["Rose"],
    baseNotes: ["White Musk"],
  },
  {
    name: "Coastal Fig",
    brandSlug: "noir-atelier",
    categorySlug: "unisex-fragrance",
    concentration: "EAU_DE_COLOGNE",
    size: "ML_100",
    price: 39500,
    badges: [],
    topNotes: ["Fig Leaf", "Bergamot"],
    heartNotes: ["Sea Salt Accord"],
    baseNotes: ["Driftwood"],
  },
  {
    name: "Amber Nights",
    brandSlug: "aurelia-house",
    categorySlug: "womens-fragrance",
    concentration: "EAU_FRAICHE",
    size: "ML_50",
    price: 32000,
    badges: ["SALE"],
    topNotes: ["Mandarin"],
    heartNotes: ["Amber"],
    baseNotes: ["Musk"],
  },
  {
    name: "Black Orchid Oud",
    brandSlug: "maison-etoile",
    categorySlug: "mens-fragrance",
    concentration: "EXTRAIT_DE_PARFUM",
    size: "ML_75",
    price: 68000,
    badges: ["BEST_SELLER", "LIMITED_EDITION"],
    topNotes: ["Black Truffle"],
    heartNotes: ["Orchid", "Oud"],
    baseNotes: ["Patchouli", "Vanilla"],
  },
  {
    name: "Green Fig & Cassis",
    brandSlug: "velour-co",
    categorySlug: "unisex-fragrance",
    concentration: "EAU_FRAICHE",
    size: "ML_100",
    price: 51000,
    badges: [],
    topNotes: ["Fig", "Cassis"],
    heartNotes: ["Green Leaves"],
    baseNotes: ["Cedar"],
  },
  {
    name: "Rose de Mai",
    brandSlug: "noir-atelier",
    categorySlug: "womens-fragrance",
    concentration: "EAU_DE_TOILETTE",
    size: "ML_50",
    price: 49000,
    badges: ["NEW", "BEST_SELLER"],
    topNotes: ["Raspberry"],
    heartNotes: ["Rose de Mai"],
    baseNotes: ["Musk", "Vanilla"],
  },
  {
    name: "Spiced Leather",
    brandSlug: "aurelia-house",
    categorySlug: "mens-fragrance",
    concentration: "EAU_DE_COLOGNE",
    size: "ML_75",
    price: 56500,
    badges: ["LIMITED_EDITION"],
    topNotes: ["Pink Pepper"],
    heartNotes: ["Leather"],
    baseNotes: ["Vetiver", "Amber"],
  },
] as const;

async function seedCatalog() {
  const brandIdBySlug = new Map<string, string>();
  for (const brand of BRANDS) {
    const record = await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: { name: brand.name },
      create: brand,
    });
    brandIdBySlug.set(brand.slug, record.id);
  }

  const categoryIdBySlug = new Map<string, string>();
  for (const category of CATEGORIES) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
    categoryIdBySlug.set(category.slug, record.id);
  }

  await prisma.product.deleteMany({
    where: { brandId: { in: [...brandIdBySlug.values()] } },
  });

  await prisma.product.createMany({
    data: PRODUCTS.map((product) => ({
      name: product.name,
      concentration: product.concentration,
      size: product.size,
      price: product.price,
      status: "PUBLISHED",
      badges: [...product.badges],
      topNotes: [...product.topNotes],
      heartNotes: [...product.heartNotes],
      baseNotes: [...product.baseNotes],
      brandId: brandIdBySlug.get(product.brandSlug)!,
      categoryId: categoryIdBySlug.get(product.categorySlug)!,
    })),
  });

  console.log(
    `Seeded ${PRODUCTS.length} products across ${BRANDS.length} brands and ${CATEGORIES.length} categories`
  );
}

async function main() {
  await seedCatalog();
  await seedAdmin();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
