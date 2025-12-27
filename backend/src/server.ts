import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma, { pool } from './config/database.js';
import authRoutes from './routes/auth.js';
import internRoutes from './routes/intern.js';
import contactRoutes from './routes/contact.js';
import googleSheetsService from './services/googleSheets.service.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL ,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/assets", express.static('src/assets'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/interns', internRoutes);
app.use('/api/contacts', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Initialize database and start server
async function startServer() {
  try {
    // Test database connection with pool first
    const client = await pool.connect();
    console.log('✅ Database pool connected');
    client.release();
    
    // Connect to database via Prisma
    await prisma.$connect();
    console.log('✅ Prisma connected');

    // Create default admin if not exists
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@technosolutions.com';
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || 'Admin@123',
        10
      );

      await prisma.admin.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: process.env.ADMIN_NAME || 'Admin User',
          role: 'admin',
        },
      });

      console.log('✅ Default admin created');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
    }

    // Initial sync on startup
    console.log('🔄 Running initial sync from Google Sheets...');
    await googleSheetsService.syncFromSheets();

    // Start periodic Google Sheets sync (every 1 minute for faster updates)
    googleSheetsService.startPeriodicSync(1);

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();