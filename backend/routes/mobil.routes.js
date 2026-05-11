const express = require('express');
const router = express.Router();

const mobilController = require('../controllers/mobil_controller');
// const { verifyToken } = require('../middleware/auth');
// const upload = require('../middleware/upload');
 
// GET /mobil - get all mobil (public)
router.get('/', mobilController.getAllMobil);
router.get('/mobil/:id', mobilController.getMobilById);

module.exports = router;