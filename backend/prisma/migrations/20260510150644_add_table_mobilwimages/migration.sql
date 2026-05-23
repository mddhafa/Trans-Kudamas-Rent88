-- CreateTable
CREATE TABLE "Mobil" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mobil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MobilFoto" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "mobilId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MobilFoto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MobilFoto" ADD CONSTRAINT "MobilFoto_mobilId_fkey" FOREIGN KEY ("mobilId") REFERENCES "Mobil"("id") ON DELETE CASCADE ON UPDATE CASCADE;
