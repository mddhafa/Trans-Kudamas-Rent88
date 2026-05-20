const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.createMobil = async (req, res) => {
    try {
    const { nama, deskripsi, kategori } = req.body;

    if (!nama || !deskripsi || !kategori) {
      return res.status(400).json({
        success: false,
        message: 'Nama, deskripsi, dan kategori harus diisi',
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Minimal satu foto harus diupload',
      });
    }

    const mobil = await prisma.mobil.create({
      data: {
        nama,
        deskripsi,
        kategori,
        fotos: {
          create: req.files.map((file) => ({
            url: `uploads/mobil/${file.filename}`,
          })),
        },
      },
      include: { fotos: true },
    });

    return res.status(201).json({
      success: true,
      message: 'Mobil berhasil ditambahkan',
      data: mobil,
    });
  } catch (error) {
    console.error('Error create mobil:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
}

exports.getAllMobil = async (req, res) => {
  try {
    const mobils = await prisma.mobil.findMany({
      include: { fotos: true },
    });

    return res.status(200).json({
      success: true,
      message: 'Daftar mobil berhasil diambil',
      data: mobils,
    });
    } catch (error) {
        console.error('Error get all mobil:', error);
        return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server', 
        });
    }
};

exports.getMobilById = async (req, res) => {
  try { 
    const { id } = req.params;
    
    const mobil = await prisma.mobil.findUnique({
      where: { id: parseInt(id) },
      include: { fotos: true },
    });

    if (!mobil) {
      return res.status(404).json({
        success: false,
        message: 'Mobil tidak ditemukan',
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Detail mobil berhasil diambil',
      data: mobil,
    });
  } catch (error) {
    console.error('Error get mobil by id:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  
  }
};

exports.updateMobil = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, deskripsi, kategori } = req.body;

    const mobil = await prisma.mobil.findUnique({
      where: { id: parseInt(id) },
      include: { fotos: true },
    });

    if (!mobil) {
      return res.status(404).json({
        success: false,
        message: 'Mobil tidak ditemukan',
      });
    }

    const updatedMobil = await prisma.mobil.update({
      where: { id: parseInt(id) },
      data: {
        nama,
        deskripsi,
        kategori,
      },
      include: { fotos: true },
    });

    // Jika ada file yang diupload pada update, simpan juga sebagai MobilFoto
    if (req.files && req.files.length > 0) {
      const fotoData = req.files.map((file) => ({ mobilId: parseInt(id), url: `uploads/mobil/${file.filename}` }));
      await prisma.mobilFoto.createMany({ data: fotoData });
      // refresh include
      const refreshed = await prisma.mobil.findUnique({ where: { id: parseInt(id) }, include: { fotos: true } });
      return res.status(200).json({
        success: true,
        message: 'Mobil berhasil diperbarui',
        data: refreshed,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Mobil berhasil diperbarui',
      data: updatedMobil,
    });
  } catch (error) {
    console.error('Error update mobil:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
};

// Hapus satu foto mobil berdasarkan id foto
exports.deleteMobilFoto = async (req, res) => {
  try {
    const { id } = req.params; // ini id foto

    const foto = await prisma.mobilFoto.findUnique({ where: { id: parseInt(id) } });
    if (!foto) {
      return res.status(404).json({ success: false, message: 'Foto tidak ditemukan' });
    }

    // hapus file fisik
    const filePath = path.join(__dirname, '..', 'uploads', 'mobil', path.basename(foto.url));
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error hapus file foto:', err);
    });

    await prisma.mobilFoto.delete({ where: { id: parseInt(id) } });

    return res.status(200).json({ success: true, message: 'Foto berhasil dihapus' });
  } catch (error) {
    console.error('Error delete mobil foto:', error);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
};

exports.deleteMobil = async (req, res) => {
  try {
    const { id } = req.params;

    const mobil = await prisma.mobil.findUnique({
      where: { id: parseInt(id) },
      include: { fotos: true },
    });

    if (!mobil) {
      return res.status(404).json({
        success: false,
        message: 'Mobil tidak ditemukan',
      });
    }

    // Hapus file foto dari server
    mobil.fotos.forEach((foto) => {
      const filePath = path.join(__dirname, '..', 'uploads', 'mobil', path.basename(foto.url));
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error hapus file foto:', err);
        }
      });
    });

    await prisma.mobil.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({
      success: true,
      message: 'Mobil berhasil dihapus',
    });
  } catch (error) {
    console.error('Error delete mobil:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
};