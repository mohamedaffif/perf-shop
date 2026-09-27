-- `phone` was added to the User model in schema.prisma (commit 6b6ba5e) without
-- a migration, so every auth query selecting users failed with
-- "column users.phone does not exist".
-- AlterTable
ALTER TABLE "users" ADD COLUMN "phone" TEXT;
