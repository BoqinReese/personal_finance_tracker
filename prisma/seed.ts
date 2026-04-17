import { PrismaClient } from './generated/client/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({ url: 'file:dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');
  
  // Clear existing data
  await prisma.transaction.deleteMany();
  await prisma.recurringRule.deleteMany();

  // Add Recurring Rules
  await prisma.recurringRule.create({
    data: {
      title: 'Monthly Salary',
      type: 'income',
      amount: 5000,
      category: 'Salary',
      startMonth: '2026-01',
      notes: 'Full-time job salary',
      isActive: true,
    }
  });

  await prisma.recurringRule.create({
    data: {
      title: 'Apartment Rent',
      type: 'expense',
      amount: 1500,
      category: 'Rent',
      startMonth: '2026-01',
      notes: 'Monthly rent for downtown apartment',
      isActive: true,
    }
  });

  // Add some one-time transactions for April 2026
  await prisma.transaction.create({
    data: {
      title: 'Groceries',
      type: 'expense',
      amount: 150.50,
      category: 'Food',
      date: new Date('2026-04-15'),
      notes: 'Weekly grocery run',
    }
  });

  await prisma.transaction.create({
    data: {
      title: 'Freelance Design',
      type: 'income',
      amount: 800,
      category: 'Freelance',
      date: new Date('2026-04-10'),
      notes: 'Logo design for client X',
    }
  });

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  });
