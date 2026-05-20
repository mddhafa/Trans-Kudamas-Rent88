const express = require('express');
const router = express.Router();

const contactController = require('../controllers/contact_controller');
const { verifyToken } = require('../middleware/auth');

router.get('/', contactController.getContactSetting);
router.put('/', verifyToken, contactController.upsertContactSetting);

module.exports = router;