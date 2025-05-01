/*
  Warnings:

  - You are about to drop the column `sale` on the `Products` table. All the data in the column will be lost.
  - Added the required column `discount` to the `Products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Products" DROP COLUMN "sale",
ADD COLUMN     "discount" INTEGER NOT NULL;
