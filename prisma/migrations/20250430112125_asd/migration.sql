/*
  Warnings:

  - Added the required column `status` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'PENDING');

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "photo" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Products" ALTER COLUMN "photo" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "UserStatus" NOT NULL,
ALTER COLUMN "photo" DROP NOT NULL;
