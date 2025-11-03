import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './models';
import { connectRedis, disconnectRedis } from './config/redis';

// Import routes
import authRoutes from './routes/authRoutes';
import patientRoutes from './routes/patientRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import treatmentRoutes from './routes/treatmentRoutes';
import invoiceRoutes from './routes/invoiceRoutes';
import staffRoutes from './routes/staffRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/treatments', treatmentRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Dental Clinic CMS API is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Database connection and server start
const startServer = async () => {
  try {
    // Connect to PostgreSQL
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync database (use { force: true } to drop tables in development)
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized.');

    // Connect to Redis (non-blocking - app continues if Redis fails)
    if (process.env.REDIS_ENABLED !== 'false') {
      await connectRedis();
    } else {
      console.log('⚠️  Redis is disabled');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await disconnectRedis();
  await sequelize.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await disconnectRedis();
  await sequelize.close();
  process.exit(0);
});

startServer();

export default app;

