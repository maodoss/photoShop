import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import routes
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import creneauRoutes from './routes/creneauRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import paiementRoutes from './routes/paiementRoutes.js';
import shootingRoutes from './routes/shootingRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/shootings', shootingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/creneaux', creneauRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/paiements', paiementRoutes);
app.use('/api/notifications', notificationRoutes);

// API root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Photo Studio API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      shootings: '/api/shootings',
      admin: '/api/admin',
      employee: '/api/employee'
    }
  });
});

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});
