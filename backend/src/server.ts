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
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use("/assets", express.static('src/assets'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/interns', internRoutes);
app.use('/api/contacts', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

// Admin dashboard stats
app.get('/api/admin/stats', async (req, res) => {
  try {
    const stats = await prisma.$transaction([
      prisma.intern.count(),
      prisma.intern.count({ where: { status: 'pending' } }),
      prisma.intern.count({ where: { status: 'active' } }),
      prisma.intern.count({ where: { status: 'completed' } }),
      prisma.intern.count({ where: { googleSheetRowId: { not: null } } }),
      prisma.intern.findFirst({ orderBy: { updatedAt: 'desc' }, select: { updatedAt: true } })
    ]);

    res.json({
      success: true,
      data: {
        total: stats[0],
        pending: stats[1],
        active: stats[2],
        completed: stats[3],
        sheetsSynced: stats[4],
        lastUpdated: stats[5]?.updatedAt || null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Stats fetch failed' });
  }
});

// Initialize database and start server
async function startServer() {
  try {
    // Test database connection
    const client = await pool.connect();
    console.log('✅ Database pool connected');
    client.release();
    
    await prisma.$connect();
    console.log('✅ Prisma connected');

    // Create default admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@technosolutions.com';
    const existingAdmin = await prisma.admin.findUnique({ where: { email: adminEmail } });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 10);
      await prisma.admin.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: process.env.ADMIN_NAME || 'Admin User',
          role: 'admin',
        },
      });
      console.log('✅ Default admin created');
      console.log(`   📧 ${adminEmail}`);
      console.log(`   🔑 ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
      console.log('   ⚠️  CHANGE PASSWORD IMMEDIATELY!');
    }

    // 🚀 INITIAL SYNC
    console.log('🔄 Running initial Google Sheets sync...');
    const initialResult = await googleSheetsService.syncFromSheets();
    console.log(`✅ Initial sync: ${initialResult.synced} new, ${initialResult.skipped} skipped, ${initialResult.errors} errors`);

    // ✅ SAFE 2 HOURS INTERVAL (12 calls/day)
    console.log('⏰ Starting SAFE periodic sync (every 2 HOURS)...');
    googleSheetsService.startPeriodicSync(120);

    // Start server
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running: http://localhost:${PORT}`);
      console.log(`📊 Endpoints ready:`);
      console.log(`   GET  /api/admin/stats`);
      console.log(`   POST /api/interns/sync/sheets`);
      console.log(`⏰ Next sync: ~2 hours`);
    });
  } catch (error) {
    console.error('❌ Server start failed:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 SIGTERM shutdown...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
