-- AlterTable
ALTER TABLE "Sessions" ADD COLUMN     "browser" TEXT,
ADD COLUMN     "os" TEXT,
ALTER COLUMN "device" DROP NOT NULL;
