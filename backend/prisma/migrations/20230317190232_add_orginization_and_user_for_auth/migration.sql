-- AlterTable
ALTER TABLE "generators" ADD COLUMN     "orginizationId" TEXT;

-- AlterTable
ALTER TABLE "members" ADD COLUMN     "orginizationId" TEXT;

-- AlterTable
ALTER TABLE "partners" ADD COLUMN     "orginizationId" TEXT;

-- AlterTable
ALTER TABLE "redeemers" ADD COLUMN     "orginizationId" TEXT;

-- CreateTable
CREATE TABLE "orginizations" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "templateName" VARCHAR(255),

    CONSTRAINT "orginizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authId" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "orginizationId" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_orginizationId_fkey" FOREIGN KEY ("orginizationId") REFERENCES "orginizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_orginizationId_fkey" FOREIGN KEY ("orginizationId") REFERENCES "orginizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generators" ADD CONSTRAINT "generators_orginizationId_fkey" FOREIGN KEY ("orginizationId") REFERENCES "orginizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "redeemers" ADD CONSTRAINT "redeemers_orginizationId_fkey" FOREIGN KEY ("orginizationId") REFERENCES "orginizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_orginizationId_fkey" FOREIGN KEY ("orginizationId") REFERENCES "orginizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
