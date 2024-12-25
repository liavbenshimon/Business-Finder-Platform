import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { subscribe, unsubscribe } from '../controllers/subscriptionController.js';

const router = express.Router();

// POST /subscriptions/subscribe/:businessId
router.post('/subscribe/:businessId', protect, subscribe);

// DELETE /subscriptions/unsubscribe/:businessId
router.delete('/unsubscribe/:businessId', protect, unsubscribe);

export default router;
