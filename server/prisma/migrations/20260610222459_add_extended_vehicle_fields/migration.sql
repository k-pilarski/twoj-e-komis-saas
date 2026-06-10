/*
  Warnings:

  - You are about to drop the column `images` on the `Vehicle` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_tenantId_fkey";

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "images",
ADD COLUMN     "bodyType" TEXT,
ADD COLUMN     "color" TEXT,
ADD COLUMN     "doors" INTEGER,
ADD COLUMN     "drivetrain" TEXT,
ADD COLUMN     "engineCapacity" INTEGER,
ADD COLUMN     "enginePower" INTEGER,
ADD COLUMN     "firstRegistration" TEXT,
ADD COLUMN     "fuelType" TEXT,
ADD COLUMN     "importedFrom" TEXT,
ADD COLUMN     "isDamaged" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isImported" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "licensePlate" TEXT,
ADD COLUMN     "mileage" INTEGER,
ADD COLUMN     "seats" INTEGER,
ADD COLUMN     "transmission" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "vin" TEXT;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
