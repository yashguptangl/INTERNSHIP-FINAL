import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// Use DIRECT_URL for direct database queries (not pooled)
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

console.log('🔗 Connecting to database:', connectionString?.substring(0, 30) + '...');

const pool = new pg.Pool({ 
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Handle pool errors
pool.on('error', (err ) => {
  console.error('Unexpected database pool error:', err);
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ 
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;
export { pool };