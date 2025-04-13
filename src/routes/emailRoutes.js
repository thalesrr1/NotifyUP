const express = require('express');
const EmailController = require('../controllers/EmailController');

const router = express.Router();

// Rota para enviar um email de teste (ou qualquer email via API)
// POST /api/emails/send
router.post('/send', EmailController.sendTestEmail);

module.exports = router;