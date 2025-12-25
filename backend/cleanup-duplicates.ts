import prisma from './src/config/database.js';
import 'dotenv/config';

async function cleanupDuplicates() {
  try {
    console.log('🧹 Cleaning up database...\n');

    // Option 1: Delete all interns (fresh start)
    const deleteAll = await prisma.intern.deleteMany({});
    console.log(`✅ Deleted ${deleteAll.count} intern records`);

    console.log('\n✨ Database cleaned! Ready for fresh sync.');
    console.log('Now restart your backend server to sync fresh data from Google Sheets.');
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDuplicates();
