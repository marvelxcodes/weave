import { PrismaClient } from '@prisma/client';

console.log('🔍 [PRISMA] Initializing Prisma client...');
console.log('  - NODE_ENV:', process.env.NODE_ENV);
console.log('  - DATABASE_URL exists:', !!process.env.DATABASE_URL);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

console.log('✅ [PRISMA] Prisma client initialized');

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  console.log('🔍 [PRISMA] Prisma client cached globally for development');
}