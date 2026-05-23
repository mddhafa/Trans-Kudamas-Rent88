-- DropForeignKey
ALTER TABLE "Pemesanan" DROP CONSTRAINT "Pemesanan_mobilId_fkey";

-- AlterTable
ALTER TABLE "Pemesanan" ALTER COLUMN "mobilId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Pemesanan" ADD CONSTRAINT "Pemesanan_mobilId_fkey" FOREIGN KEY ("mobilId") REFERENCES "Mobil"("id") ON DELETE SET NULL ON UPDATE CASCADE;
