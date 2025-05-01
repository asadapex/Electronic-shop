/*
  Warnings:

  - You are about to drop the column `bigCategoryId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the `BigCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CategoryEnum" AS ENUM ('Phone', 'Electronics', 'Laptops', 'Accessories');

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_bigCategoryId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "bigCategoryId",
ADD COLUMN     "type" "CategoryEnum" NOT NULL;

-- DropTable
DROP TABLE "BigCategory";
