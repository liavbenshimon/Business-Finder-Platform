import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import businessRoutes from './routes/businessRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import { protect } from './middleware/authMiddleware.js';
import { createServer } from "http";

dotenv.config();
const app = express();
const server = http.createServer(app);
// const io = socketIo(server); // Initialize Socket.IO

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });
  
// Middleware
app.use(express.json());
app.use(cors()); // Enable cross-origin requests

// Routes
app.use('/auth', authRoutes); // Authentication routes (Signup, Login, etc.)
// app.use(protect); // Assuming authentication is in place
app.use('/businesses', businessRoutes); // Business routes (CRUD operations)
app.use('/subscriptions', subscriptionRoutes); // Subscription routes
app.use('/reviews', reviewRoutes); // Review routes

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log('A user connected');


  // Listen for a user subscribing to a business for updates
  socket.on('subscribe', (businessId) => {
    console.log(`User subscribed to business: ${businessId}`);
    socket.join(businessId); // Join the business room
  });

  // Listen for disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

export { io };

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    server.listen(process.env.PORT || 5000, () => {
      console.log('Server running on port 5000');
    });
  })
  .catch(err => console.log(err));
