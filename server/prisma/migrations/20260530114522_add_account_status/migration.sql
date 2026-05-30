-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('PENDING', 'ACTIVE', 'EXPIRED');

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "status" "AccountStatus" NOT NULL DEFAULT 'PENDING';
