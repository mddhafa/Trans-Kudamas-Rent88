const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

//customers section
exports.createPemesanan = async (req, res) => {
    try {
        const { nama, mobilId, tanggalMulai, tanggalSelesai, lokasiPenjemputan, tujuan, jam, noWa, email, perusahaan, catatan } = req.body;

        // Validasi input
        if (!nama || !mobilId || !tanggalMulai || !tanggalSelesai || !lokasiPenjemputan || !tujuan || !jam || !noWa) {
            return res.status(400).json({
                success: false,
                message: 'Semua field wajib diisi',
            });
        }

        // Simpan pemesanan ke database (contoh menggunakan Prisma)
        const pemesanan = await prisma.pemesanan.create({
            data: {
                nama,
                mobilId: parseInt(mobilId),
                tanggalMulai: new Date(tanggalMulai),
                tanggalSelesai: new Date(tanggalSelesai),
                lokasiPenjemputan,
                tujuan,
                jam,
                noWa,
                perusahaan,
                catatan,
            },
            include: { mobil: true }, // Include data mobil terkait
        });

        const pesanWaAdmin = `
        *Halo admin, saya ingin melakukan pemesanan*
        -----------------------------------
        *Nama:* ${nama}
        *Jenis Mobil:* ${pemesanan.mobil.nama}
        *Tanggal Mulai:* ${new Date(tanggalMulai).toLocaleDateString('id-ID')}
        *Tanggal Selesai:* ${new Date(tanggalSelesai).toLocaleDateString('id-ID')}
        *Jam:* ${jam}
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
      tanggalMulai,
      tanggalSelesai,
      lokasiPenjemputan,
      tujuan,
      jam,
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

    const updated = await prisma.pemesanan.update({
      where: { id: parseInt(id) },
      data: {
        ...(nama && { nama }),
        ...(mobilId && { mobilId: parseInt(mobilId) }),
        ...(tanggalMulai && { tanggalMulai: new Date(tanggalMulai) }),
        ...(tanggalSelesai && { tanggalSelesai: new Date(tanggalSelesai) }),
        ...(lokasiPenjemputan && { lokasiPenjemputan }),
        ...(tujuan && { tujuan }),
        ...(jam && { jam }),
        ...(noWa && { noWa }),
        ...(email !== undefined && { email: email || null }),
        ...(catatan !== undefined && { catatan: catatan || null }),
        ...(status !== undefined && { status: status || null }),
      },
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