import { PrismaClient } from '../prisma/generated/client/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// In Prisma 7, the adapter handles the database connection internally
const adapter = new PrismaBetterSqlite3({ url: 'file:dev.db' });

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export * from '../prisma/generated/client/client';
export { TransactionType } from '../prisma/generated/client/enums';
