import { Business } from '../models/business.js';
import { User } from '../models/user.js';

export const subscribe = async (req, res) => {
  const { businessId } = req.params;
  const userId = req.user.id;

  try {
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    if (business.subscribers.includes(userId)) {
      return res.status(400).json({ message: 'Already subscribed' });
    }

    business.subscribers.push(userId);
    await business.save();
    res.json({ message: 'Subscribed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const unsubscribe = async (req, res) => {
  const { businessId } = req.params;
  const userId = req.user.id;

  try {
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    if (!business.subscribers.includes(userId)) {
      return res.status(400).json({ message: 'Not subscribed' });
    }

    business.subscribers = business.subscribers.filter(
      (subscriber) => subscriber.toString() !== userId
    );
    await business.save();
    res.json({ message: 'Unsubscribed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
