const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin_controller');
const mobilController = require('../controllers/mobil_controller');
const pemesananController = require('../controllers/pemesanan_controller');
const recapController = require('../controllers/recap_controller');

const upload = require('../middleware/upload');
const { verifyToken } = require('../middleware/auth');

// Admin Authentication Routes
router.post('/login', adminController.login);
router.post('/register', adminController.register);
router.get('/profile', verifyToken, adminController.getProfile);

// Mobil Section Routes
router.post('/tambah-mobil', verifyToken, upload.array('fotos', 5), mobilController.createMobil);
router.put('/mobil:id', verifyToken, upload.array('fotos', 5), mobilController.updateMobil);
router.delete('/mobil:id', verifyToken, mobilController.deleteMobil);
// Delete single foto by id (admin)
router.delete('/mobil/foto/:id', verifyToken, mobilController.deleteMobilFoto);

// Pemesanan Section Routes
router.get('/pemesanan', verifyToken, pemesananController.getPemesanan);
router.get('/pemesanan/:id', verifyToken, pemesananController.getPemesananById);
router.put('/pemesanan/:id', verifyToken, pemesananController.updatePemesanan);

// Laporan Section Routes

// Protected - admin only
router.get('/bulanan', verifyToken, recapController.laporanBulanan);
router.get('/tahunan', verifyToken, recapController.laporanTahunan);
module.exports = router;