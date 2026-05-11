const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Laporan per bulan
exports.laporanBulanan = async (req, res) => {
  try {
    const { bulan, tahun } = req.query;

    if (!bulan || !tahun) {
      return res.status(400).json({
        success: false,
        message: 'Bulan dan tahun harus diisi',
      });
    }

    const startDate = new Date(tahun, bulan - 1, 1);
    const endDate = new Date(tahun, bulan, 0, 23, 59, 59);

    const pemesanan = await prisma.pemesanan.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { mobil: true },
      orderBy: { createdAt: 'desc' },
    });

    const rekap = {
      total: pemesanan.length,
      pending: pemesanan.filter((p) => p.status === 'PENDING').length,
      dikonfirmasi: pemesanan.filter((p) => p.status === 'DIKONFIRMASI').length,
      ditolak: pemesanan.filter((p) => p.status === 'DITOLAK').length,
      selesai: pemesanan.filter((p) => p.status === 'SELESAI').length,
    };

    return res.status(200).json({
      success: true,
      periode: `${bulan}/${tahun}`,
      rekap,
      data: pemesanan,
    });
  } catch (error) {
    console.error('Error laporan bulanan:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
};

// Laporan per tahun
exports.laporanTahunan = async (req, res) => {
  try {
    const { tahun } = req.query;

    if (!tahun) {
      return res.status(400).json({
        success: false,
        message: 'Tahun harus diisi',
      });
    }

    const startDate = new Date(tahun, 0, 1);
    const endDate = new Date(tahun, 11, 31, 23, 59, 59);

    const pemesanan = await prisma.pemesanan.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { mobil: true },
      orderBy: { createdAt: 'desc' },
    });

    // Rekap per bulan
    const rekapPerBulan = Array.from({ length: 12 }, (_, i) => {
      const bulanData = pemesanan.filter(
        (p) => new Date(p.createdAt).getMonth() === i
      );
      return {
        bulan: new Date(tahun, i, 1).toLocaleString('id-ID', { month: 'long' }),
        total: bulanData.length,
        pending: bulanData.filter((p) => p.status === 'PENDING').length,
        dikonfirmasi: bulanData.filter((p) => p.status === 'DIKONFIRMASI').length,
        ditolak: bulanData.filter((p) => p.status === 'DITOLAK').length,
        selesai: bulanData.filter((p) => p.status === 'SELESAI').length,
      };
    });

    const rekap = {
      total: pemesanan.length,
      pending: pemesanan.filter((p) => p.status === 'PENDING').length,
      dikonfirmasi: pemesanan.filter((p) => p.status === 'DIKONFIRMASI').length,
      ditolak: pemesanan.filter((p) => p.status === 'DITOLAK').length,
      selesai: pemesanan.filter((p) => p.status === 'SELESAI').length,
    };

    return res.status(200).json({
      success: true,
      periode: tahun,
      rekap,
      rekapPerBulan,
      data: pemesanan,
    });
  } catch (error) {
    console.error('Error laporan tahunan:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
};