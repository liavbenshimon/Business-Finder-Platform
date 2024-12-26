import express from 'express';
import { createBusiness, getBusinessById, subscribeToBusiness, createBusinessUpdate, unsubscribeFromBusiness, deleteBusiness, getAllBusinesses } from '../controllers/businessController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/',protect, createBusiness);
router.get('/', getAllBusinesses);
router.get('/:businessId', getBusinessById);
router.post('/:businessId/subscribe',protect, subscribeToBusiness);
router.put('/:businessId',protect, createBusinessUpdate);
router.delete('/:businessId/unsubscribe',protect, unsubscribeFromBusiness);
router.delete('/:businessId',protect, deleteBusiness);

export default router;
