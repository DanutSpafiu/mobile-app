import { PrismaClient } from '../../generated/prisma/client';

// Singleton pattern for Prisma Client
// This ensures we only have one database connection instance
const prismaClientSingleton = () => {
  // For Prisma 7, you need either accelerateUrl OR adapter
  // For direct SQLite connection, we'll use an empty accelerateUrl as a workaround
  // In production with Accelerate, set PRISMA_ACCELERATE_URL environment variable
  const accelerateUrl = process.env.PRISMA_ACCELERATE_URL;
  
  if (accelerateUrl) {
    // Using Prisma Accelerate
    return new PrismaClient({
      accelerateUrl,
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
      errorFormat: 'pretty',
    });
  } else {
    // Direct connection - Prisma 7 requires accelerateUrl or adapter
    // Using empty string as workaround for direct SQLite connection
    // TODO: Consider installing @prisma/adapter-sqlite for proper adapter support
    return new PrismaClient({
      accelerateUrl: '', // Empty string for direct connection workaround
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
      errorFormat: 'pretty',
    } as any);
  }
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

