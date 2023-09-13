/*
  Warnings:

  - You are about to drop the column `code` on the `generators` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `redeemers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "generators" DROP COLUMN "code";

-- AlterTable
ALTER TABLE "redeemers" DROP COLUMN "code";

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "partnerId" TEXT;

-- CreateTable
CREATE TABLE "partners" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;
