import { Business } from '../models/business.js';
import { User } from '../models/user.js';
import { io } from '../server.js'; // Assuming Socket.IO is exported from server.js

// Create a business (authenticated)
export const createBusiness = async (req, res) => {
  const { name, description, category } = req.body;
  console.log(req.user);
  
  const userId = req.user.id;

  try {
    const business = new Business({
      name,
      description,
      category,
      owner: userId,
      subscribers: [],
    });

    await business.save();
    res.status(201).json(business);
  } catch (err) {
    res.status(500).json({ message: 'Error creating business' });
  }
};

// Get business details by ID
export const getBusinessById = async (req, res) => {
  const { businessId } = req.params;

  try {
    const business = await Business.findById(businessId).populate('owner subscribers reviews.user');
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    res.json(business);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Subscribe a user to a business
export const subscribeToBusiness = async (req, res) => {
  const { businessId } = req.params;
  const userId = req.user.id;

  try {
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    // Check if the user is already subscribed
    if (business.subscribers.includes(userId)) {
      return res.status(400).json({ message: 'User already subscribed' });
    }

    business.subscribers.push(userId);
    await business.save();

    // Emit real-time notification to all subscribers
    io.to(businessId).emit('new-subscription', {
      message: 'New user has subscribed to your business',
      subscriber: req.user.name,
    });

    res.status(200).json({ message: 'Subscription successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a business update and emit notification to subscribers
export const createBusinessUpdate = async (req, res) => {
    const { updateText } = req.body; // עדכון מהגוף
    const { businessId } = req.params; // מזהה העסק מהנתיב
  
    try {
      const business = await Business.findById(businessId);
      if (!business) {
        return res.status(404).json({ message: 'Business not found' });
      }
  
      // שמירת העדכון במודל העסק
      business.updates.push({ text: updateText, createdAt: Date.now() });
      await business.save();
  
      // שליחת עדכון לכל המשתמשים המנויים
      io.to(businessId).emit('new-update', {
        message: 'New update from the business',
        update: updateText,
      });
  
      res.status(200).json({ message: 'Business update created' });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
// Unsubscribe a user from a business
export const unsubscribeFromBusiness = async (req, res) => {
  const { businessId } = req.params;
  const userId = req.user.id;

  try {
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    // Remove user from subscribers
    business.subscribers = business.subscribers.filter(subscriber => subscriber.toString() !== userId);
    await business.save();

    // Emit real-time notification
    io.to(businessId).emit('user-unsubscribed', {
      message: 'A user has unsubscribed from your business',
      subscriber: req.user.name,
    });

    res.status(200).json({ message: 'Unsubscribed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a business (only owner can delete)
export const deleteBusiness = async (req, res) => {
  const { businessId } = req.params;
  const userId = req.user.id;

  try {
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    // Check if the current user is the owner
    if (business.owner.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    await business.remove();
    res.status(200).json({ message: 'Business deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a list of all businesses
export const getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find();
    res.json(businesses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
