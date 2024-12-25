import { Business } from '../models/business.js';

// Post a review for a business
export const postReview = async (req, res) => {
  const { businessId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;

  try {
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    const review = { user: userId, rating, comment, createdAt: Date.now() };
    business.reviews.push(review);
    await business.save();

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all reviews for a business
export const getReviews = async (req, res) => {
  const { businessId } = req.params;

  try {
    const business = await Business.findById(businessId).populate('reviews.user');
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    res.json(business.reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
