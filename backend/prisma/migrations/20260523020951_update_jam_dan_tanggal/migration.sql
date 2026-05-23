/*
  Warnings:

  - You are about to drop the column `jam` on the `Pemesanan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pemesanan" DROP COLUMN "jam",
ADD COLUMN     "jamMulai" TEXT,
ADD COLUMN     "jamSelesai" TEXT,
ALTER COLUMN "tanggalSelesai" DROP NOT NULL;
