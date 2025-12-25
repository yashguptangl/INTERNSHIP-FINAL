import prisma from './src/config/database.js';
import 'dotenv/config';

async function fixDataSwap() {
  try {
    console.log('🔧 Fixing swapped name and email data...\n');

    // Find all interns where email looks like a name (doesn't contain @)
    const interns = await prisma.intern.findMany();

    let fixedCount = 0;
    let skippedCount = 0;

    for (const intern of interns) {
      // Check if email field doesn't have @ (means it's actually a name)
      if (intern.email && !intern.email.includes('@')) {
        console.log(`Found swapped data for: ${intern.id}`);
        console.log(`  Current name: ${intern.name}`);
        console.log(`  Current email: ${intern.email}`);

        // Swap name and email
        await prisma.intern.update({
          where: { id: intern.id },
          data: {
            name: intern.email,  // email field has the name
            email: intern.name,  // name field has the email
          },
        });

        console.log(`  ✅ Fixed: name="${intern.email}", email="${intern.name}"\n`);
        fixedCount++;
      } else {
        skippedCount++;
      }
    }

    console.log('='.repeat(50));
    console.log(`✅ Fixed: ${fixedCount} interns`);
    console.log(`⏭️ Skipped: ${skippedCount} interns (already correct)`);
    console.log('='.repeat(50));
  } catch (error) {
    console.error('❌ Error fixing data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixDataSwap();
