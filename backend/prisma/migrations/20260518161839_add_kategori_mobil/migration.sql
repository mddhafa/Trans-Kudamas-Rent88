/*
  Warnings:

  - Added the required column `kategori` to the `Mobil` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "KategoriMobil" AS ENUM ('Minibus', 'Bus');

-- AlterTable
ALTER TABLE "Mobil" ADD COLUMN     "kategori" "KategoriMobil" NOT NULL DEFAULT 'Minibus';
