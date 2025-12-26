/*
  Warnings:

  - A unique constraint covering the columns `[applicationId]` on the table `interns` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "interns" ADD COLUMN     "applicationId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "interns_applicationId_key" ON "interns"("applicationId");
