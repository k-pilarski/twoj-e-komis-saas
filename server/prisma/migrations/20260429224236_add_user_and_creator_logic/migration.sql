/*
  Warnings:

  - You are about to drop the column `layout` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `theme` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Vehicle` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ownerId]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerId` to the `Tenant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "layout",
DROP COLUMN "theme",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "fontStyle" TEXT NOT NULL DEFAULT 'SANS',
ADD COLUMN     "hasContactPage" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "hasRegulationsPage" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "layoutType" TEXT NOT NULL DEFAULT 'GRID',
ADD COLUMN     "phoneNumber" TEXT;

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "imageUrl",
ADD COLUMN     "images" TEXT[];

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "isSubscribed" BOOLEAN NOT NULL DEFAULT false,
    "subscriptionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_ownerId_key" ON "Tenant"("ownerId");

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
