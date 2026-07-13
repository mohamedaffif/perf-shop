
// ======================================================
// ENUMS
// ======================================================

enum ProductStatus {
  DRAFT
  PUBLISHED
}

enum Concentration {
  EXTRAIT_DE_PARFUM
  EAU_DE_PARFUM
  EAU_DE_TOILETTE
  EAU_DE_COLOGNE
  EAU_FRAICHE
}

enum Badge {
  NEW
  BEST_SELLER
  LIMITED_EDITION
  SALE
}

enum Size {
  ML_50
  ML_75
  ML_100
}

// ======================================================
// BRAND
// ======================================================

model Brand {
  id          String    @id @default(cuid())
  name        String    @unique
  slug        String    @unique
  description String?

  products    Product[]

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@map("brands")
}

// ======================================================
// CATEGORY
// ======================================================

model Category {
  id          String    @id @default(cuid())
  name        String    @unique
  slug        String    @unique
  description String?

  products    Product[]

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@map("categories")
}

// ======================================================
// PRODUCT
// ======================================================

model Product {
  id              String          @id @default(cuid())

  name            String

  description     String?

  concentration   Concentration

  topNotes        String[]
  heartNotes      String[]
  baseNotes       String[]

  size            Size

  price           Decimal         @db.Decimal(10, 2)

  stockQuantity   Int             @default(0)

  status          ProductStatus   @default(DRAFT)

  badges          Badge[]         @default([])

  // Relations

  brandId         String
  brand           Brand           @relation(fields: [brandId], references: [id])

  categoryId      String
  category        Category        @relation(fields: [categoryId], references: [id])

  images          ProductImage[]

  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  @@map("products")
}

// ======================================================
// PRODUCT IMAGE
// ======================================================

model ProductImage {
  id          String    @id @default(cuid())

  url         String

  altText     String?

  isPrimary   Boolean   @default(false)

  order       Int       @default(0)

  productId   String
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  @@map("product_images")
}
