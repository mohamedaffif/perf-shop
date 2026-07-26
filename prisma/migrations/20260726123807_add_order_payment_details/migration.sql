-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "failureReason" TEXT,
ADD COLUMN     "gatewayResponse" JSONB,
ADD COLUMN     "paidAt" TIMESTAMP(3);
