import { PrismaClient } from '../../generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// Get the database path from DATABASE_URL or use default
const getDatabasePath = () => {
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && dbUrl.startsWith('file:')) {
    return dbUrl.replace('file:', '');
  }
  // Default path
  return './prisma/dev.db';
};

// Singleton pattern for Prisma Client
// This ensures we only have one database connection instance
const prismaClientSingleton = () => {
  const accelerateUrl = process.env.PRISMA_ACCELERATE_URL;
  
  const logLevels: ('query' | 'info' | 'warn' | 'error')[] = 
    process.env.NODE_ENV === 'development' 
      ? ['query', 'info', 'warn', 'error']
      : ['error'];

  if (accelerateUrl) {
    // Using Prisma Accelerate
    return new PrismaClient({
      accelerateUrl,
      log: logLevels,
      errorFormat: 'pretty',
    });
  } else {
    // Direct SQLite connection using better-sqlite3 adapter
    const adapter = new PrismaBetterSqlite3({
      url: getDatabasePath(),
    });
    
    return new PrismaClient({
      adapter,
      log: logLevels,
      errorFormat: 'pretty',
    });
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

