-- CreateIndex
CREATE INDEX "products_status_createdAt_idx" ON "products"("status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "products_brandId_idx" ON "products"("brandId");

-- CreateIndex
CREATE INDEX "products_categoryId_idx" ON "products"("categoryId");

-- CreateIndex
CREATE INDEX "product_images_productId_idx" ON "product_images"("productId");

-- CreateIndex
CREATE INDEX "orders_paymentReference_idx" ON "orders"("paymentReference");

-- CreateIndex
CREATE INDEX "orders_createdAt_idx" ON "orders"("createdAt");
