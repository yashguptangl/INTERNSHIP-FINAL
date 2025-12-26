/*
  Warnings:

  - You are about to drop the column `applicationId` on the `interns` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `interns` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "interns_applicationId_key";

-- AlterTable
ALTER TABLE "interns" DROP COLUMN "applicationId";

-- CreateIndex
CREATE UNIQUE INDEX "interns_email_key" ON "interns"("email");
