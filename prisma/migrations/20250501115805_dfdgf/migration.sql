/*
  Warnings:

  - You are about to drop the `ColorProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ColorProduct" DROP CONSTRAINT "ColorProduct_colorId_fkey";

-- DropForeignKey
ALTER TABLE "ColorProduct" DROP CONSTRAINT "ColorProduct_productId_fkey";

-- DropTable
DROP TABLE "ColorProduct";

-- CreateTable
CREATE TABLE "_ColorProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ColorProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ColorProduct_B_index" ON "_ColorProduct"("B");

-- AddForeignKey
ALTER TABLE "_ColorProduct" ADD CONSTRAINT "_ColorProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Color"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ColorProduct" ADD CONSTRAINT "_ColorProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
