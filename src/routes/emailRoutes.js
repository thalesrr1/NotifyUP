import { Router } from 'express';
import emailController from '../controllers/EmailController.js';

const router = Router();

// Rota para enviar um email de teste (ou qualquer email via API)
// POST /api/emails/send
router.post('/send', emailController.sendTestEmail);  // Enviar email de teste 

export default router;