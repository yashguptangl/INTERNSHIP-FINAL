-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interns" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "gender" TEXT,
    "country" TEXT,
    "domain" TEXT NOT NULL,
    "appliedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "phase" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "offerLetterSent" BOOLEAN NOT NULL DEFAULT false,
    "certificateSent" BOOLEAN NOT NULL DEFAULT false,
    "address" TEXT,
    "college" TEXT,
    "degree" TEXT,
    "year" TEXT,
    "socialMedia" TEXT,
    "googleSheetRowId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interns_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "interns_employeeId_key" ON "interns"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "interns_email_key" ON "interns"("email");

-- CreateIndex
CREATE INDEX "interns_employeeId_idx" ON "interns"("employeeId");

-- CreateIndex
CREATE INDEX "interns_email_idx" ON "interns"("email");

-- CreateIndex
CREATE INDEX "interns_status_idx" ON "interns"("status");

-- CreateIndex
CREATE INDEX "interns_domain_idx" ON "interns"("domain");
