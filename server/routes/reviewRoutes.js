import express from "express";
import { postReview, getReviews } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to get reviews for a specific business
router.get("/:businessId/reviews", getReviews);

// Route to add a review for a specific business (protected route)
router.post("/:businessId/review", protect, postReview);

export default router;
