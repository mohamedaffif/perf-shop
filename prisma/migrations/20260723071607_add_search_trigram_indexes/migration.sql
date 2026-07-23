-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateIndex
CREATE INDEX "brands_name_trgm_idx" ON "brands" USING GIN ("name" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "products_name_trgm_idx" ON "products" USING GIN ("name" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "products_description_trgm_idx" ON "products" USING GIN ("description" gin_trgm_ops);
