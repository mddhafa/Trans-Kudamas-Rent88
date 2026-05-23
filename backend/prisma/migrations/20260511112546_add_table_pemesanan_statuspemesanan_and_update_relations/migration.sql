-- CreateEnum
CREATE TYPE "StatusPemesanan" AS ENUM ('PENDING', 'DIKONFIRMASI', 'DITOLAK', 'DIBATALKAN', 'SELESAI');

-- CreateTable
CREATE TABLE "Pemesanan" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "mobilId" INTEGER NOT NULL,
    "tanggalMulai" TIMESTAMP(3) NOT NULL,
    "tanggalSelesai" TIMESTAMP(3) NOT NULL,
    "lokasiPenjemputan" TEXT NOT NULL,
    "tujuan" TEXT NOT NULL,
    "jam" TEXT NOT NULL,
    "noWa" TEXT NOT NULL,
    "email" TEXT,
    "perusahaan" TEXT,
    "catatan" TEXT,
    "status" "StatusPemesanan" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pemesanan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pemesanan" ADD CONSTRAINT "Pemesanan_mobilId_fkey" FOREIGN KEY ("mobilId") REFERENCES "Mobil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
