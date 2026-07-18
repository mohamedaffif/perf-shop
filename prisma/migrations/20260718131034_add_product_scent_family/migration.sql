/*
  Warnings:

  - Added the required column `scentFamily` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ScentFamily" AS ENUM ('FLORAL', 'ORIENTAL', 'FRESH', 'WOODY', 'AROMATIC', 'CITRUS', 'SPICY');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "scentFamily" "ScentFamily" NOT NULL;
