const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Login Admin
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'email dan password harus diisi',
      });
    }

    // Cari admin berdasarkan username
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'email atau password salah',
      });
    }

    // Verifikasi password
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'email atau password salah',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login berhasil',
      data: {
        id: admin.id,
        email: admin.email,
        token,
      },
    });
  } catch (error) {
    console.error('Error login:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
};

// Register Admin (untuk development/testing)

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body; // ← tambah email

    if (!username || !email || !password) { // ← validasi email
      return res.status(400).json({
        success: false,
        message: 'Username, email, dan password harus diisi',
      });
    }

    const existingAdmin = await prisma.admin.findUnique({
      where: { username },
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Username sudah terdaftar',
      });
    }

    // Cek email sudah ada
    const existingEmail = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.admin.create({
      data: {
        username,
        email, // ← tambah
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Admin berhasil terdaftar',
      data: {
        id: newAdmin.id,
        username: newAdmin.username,
        email: newAdmin.email, // ← tambah
      },
    });
  } catch (error) {
    console.error('Error register:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
};

// Get current admin profile
exports.getProfile = async (req, res) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.id },
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin tidak ditemukan',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: admin.id,
        username: admin.username,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    console.error('Error get profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
};

exports.createMobil = async (req, res) => {
  
};