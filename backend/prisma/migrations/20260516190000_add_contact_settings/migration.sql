-- CreateTable
CREATE TABLE "ContactSetting" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsappNumber" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactSetting_pkey" PRIMARY KEY ("id")
);

-- Seed default contact setting
INSERT INTO "ContactSetting" ("phone", "whatsappNumber", "email", "updatedAt")
VALUES ('+6289514693178', '6289514693178', 'info@agilrent.com', CURRENT_TIMESTAMP);