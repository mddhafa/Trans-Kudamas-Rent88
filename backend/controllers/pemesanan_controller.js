const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

//customers section
exports.createPemesanan = async (req, res) => {
    try {
        const {
            nama,
            mobilId,
            Layanan,
            tanggalMulai,
            tanggalSelesai,
            lokasiPenjemputan,
            tujuan,
            jamMulai,
            jamSelesai,
            noWa,
            email,
            perusahaan,
            catatan,
        } = req.body;

        const isHourlyRental = Layanan === 'SEWA_PER_JAM';
        const isDailyRental = Layanan === 'SEWA_HARIAN';

        // Validasi input
        if (!nama || !mobilId || !Layanan || !tanggalMulai || !lokasiPenjemputan || !tujuan || !noWa) {
            return res.status(400).json({
                success: false,
                message: 'Semua field wajib diisi',
            });
        }

        if (isDailyRental && !tanggalSelesai) {
            return res.status(400).json({
                success: false,
                message: 'Tanggal selesai wajib diisi untuk sewa harian',
            });
        }

        if (isHourlyRental && (!jamMulai || !jamSelesai)) {
            return res.status(400).json({
                success: false,
                message: 'Jam mulai dan jam selesai wajib diisi untuk sewa per jam',
            });
        }

        if (isDailyRental && !jamMulai) {
            return res.status(400).json({
                success: false,
                message: 'Jam penjemputan wajib diisi untuk sewa harian',
            });
        }

        // Lookup mobil name to denormalize into pemesanan (so name remains if mobil is deleted)
        const mobilRecord = await prisma.mobil.findUnique({ where: { id: parseInt(mobilId) } });

        // Simpan pemesanan ke database (contoh menggunakan Prisma)
        const pemesanan = await prisma.pemesanan.create({
            data: {
                nama,
                mobilId: parseInt(mobilId),
                mobilNama: mobilRecord ? mobilRecord.nama : null,
                Layanan,
                tanggalMulai: new Date(tanggalMulai),
                tanggalSelesai: tanggalSelesai ? new Date(tanggalSelesai) : null,
                lokasiPenjemputan,
                tujuan,
                jamMulai,
                jamSelesai: jamSelesai || null,
                noWa,
                email: email || null,
                perusahaan : perusahaan || null,
                catatan : catatan || null,
            },
            include: { mobil: true }, // Include data mobil terkait
        });

        const layananLabel = {
            SEWA_PER_JAM: 'Sewa per jam',
            SEWA_HARIAN: 'Sewa harian',
            CITY_TOUR: 'City Tour',
            LUAR_KOTA: 'Luar Kota',
            DROP_OFF: 'Drop Off',
            LAINNYA: 'Lainnya',
        }[Layanan] || Layanan;

        const detailWaktu = isHourlyRental
            ? `*Tanggal Sewa:* ${new Date(tanggalMulai).toLocaleDateString('id-ID')}\n*Jam Mulai:* ${jamMulai}\n*Jam Selesai:* ${jamSelesai}`
            : `*Tanggal Mulai:* ${new Date(tanggalMulai).toLocaleDateString('id-ID')}\n*Tanggal Selesai:* ${tanggalSelesai ? new Date(tanggalSelesai).toLocaleDateString('id-ID') : '-'}\n*Jam:* ${jamMulai}`;

        const kendaraanNamaForMsg = pemesanan.mobil ? pemesanan.mobil.nama : pemesanan.mobilNama || '-';

        const pesanWaAdmin = `
        *Halo admin, saya ingin melakukan pemesanan*
        -----------------------------------
        *Nama:* ${nama}
        *Jenis Mobil:* ${kendaraanNamaForMsg}
        *Layanan:* ${layananLabel}
        ${detailWaktu}
        *Lokasi Penjemputan:* ${lokasiPenjemputan}
        *Tujuan:* ${tujuan}
        *No WhatsApp:* ${noWa}
        ${email ? `*Email:* ${email}` : ''}
        ${perusahaan ? `*Perusahaan:* ${perusahaan}` : ''}
        ${catatan ? `*Catatan:* ${catatan}` : ''}
        -----------------------------------
        Mohon konfirmasi pemesanan saya. Terima kasih!
        `.trim();
        const noWaAdmin = process.env.NO_WA_ADMIN; // Ambil nomor WA admin dari .env
        const urlWa = `https://wa.me/${noWaAdmin}?text=${encodeURIComponent(pesanWaAdmin)}`;

        return res.status(201).json({
            success: true,
            message: 'Pemesanan berhasil dibuat',
            data: pemesanan,
            waUrl: urlWa, // Kirim link WA untuk konfirmasi
        }); 
    } catch (error) {
        console.error('Error create pemesanan:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server',
        });
    }
}


//admin section
// Update pemesanan
exports.updatePemesanan = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nama,
      mobilId,
            Layanan,
      tanggalMulai,
      tanggalSelesai,
      lokasiPenjemputan,
      tujuan,
            jamMulai,
            jamSelesai,
      noWa,
      email,
      catatan,
      status, // Tambahkan status untuk update status pemesanan
    } = req.body;

    const pemesanan = await prisma.pemesanan.findUnique({
      where: { id: parseInt(id) },
    });

    if (!pemesanan) {
      return res.status(404).json({
        success: false,
        message: 'Pemesanan tidak ditemukan',
      });
    }

        // if mobilId provided, lookup mobil name to persist into mobilNama
        let mobilNamaToSet;
        if (mobilId) {
            const mobilRec = await prisma.mobil.findUnique({ where: { id: parseInt(mobilId) } });
            mobilNamaToSet = mobilRec ? mobilRec.nama : null;
        }

        const updated = await prisma.pemesanan.update({
            where: { id: parseInt(id) },
            data: Object.assign(
                {},
                nama ? { nama } : {},
                mobilId ? { mobilId: parseInt(mobilId) } : {},
                mobilId ? { mobilNama: mobilNamaToSet } : {},
                Layanan ? { Layanan } : {},
                tanggalMulai ? { tanggalMulai: new Date(tanggalMulai) } : {},
                (tanggalSelesai !== undefined) ? { tanggalSelesai: tanggalSelesai ? new Date(tanggalSelesai) : null } : {},
                lokasiPenjemputan ? { lokasiPenjemputan } : {},
                tujuan ? { tujuan } : {},
                (jamMulai !== undefined) ? { jamMulai: jamMulai || null } : {},
                (jamSelesai !== undefined) ? { jamSelesai: jamSelesai || null } : {},
                noWa ? { noWa } : {},
                (email !== undefined) ? { email: email || null } : {},
                (catatan !== undefined) ? { catatan: catatan || null } : {},
                (status !== undefined) ? { status: status || null } : {}
            ),
            include: { mobil: true },
        });

    return res.status(200).json({
      success: true,
      message: 'Pemesanan berhasil diupdate',
      data: updated,
    });
  } catch (error) {
    console.error('Error update pemesanan:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
};

exports.getPemesanan = async (req, res) => {
    try {
        const pemesanan = await prisma.pemesanan.findMany({
            include: { mobil: true }, // Include data mobil terkait
        });
        return res.status(200).json({
            success: true,
            message: 'Pemesanan berhasil diambil',
            data: pemesanan,
        });
    } catch (error) {
        console.error('Error get pemesanan:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server',
        });
    }
};

exports.getPemesananById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Parameter id wajib disertakan',
            });
        }

        const parsedId = parseInt(id, 10);
        if (Number.isNaN(parsedId)) {
            return res.status(400).json({
                success: false,
                message: 'Parameter id tidak valid',
            });
        }

        const pemesanan = await prisma.pemesanan.findUnique({
            where: { id: parsedId },
            include: { mobil: true }, // Include data mobil terkait
        });

        if (!pemesanan) {
            return res.status(404).json({
                success: false,
                message: 'Pemesanan tidak ditemukan',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Detail pemesanan berhasil diambil',
            data: pemesanan,
        });
    } catch (error) {
        console.error('Error get pemesanan by id:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server',
        });
    }
};