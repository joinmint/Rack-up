/*
  Warnings:

  - You are about to drop the column `accountBalanced` on the `members` table. All the data in the column will be lost.
  - Added the required column `accountBalance` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "members" DROP COLUMN "accountBalanced",
ADD COLUMN     "accountBalance" INTEGER NOT NULL;
