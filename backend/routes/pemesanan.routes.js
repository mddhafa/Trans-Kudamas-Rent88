const express = require('express');
const router = require('express').Router();
const pemesananController = require('../controllers/pemesanan_controller');

// POST /pemesanan - create new pemesanan
router.post('/pesan-mobil', pemesananController.createPemesanan);

module.exports = router;