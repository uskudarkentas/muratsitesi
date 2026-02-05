import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton
 * 
 * This ensures we only create one instance of PrismaClient
 * across the entire application, preventing connection pool exhaustion.
 */
const prismaClientSingleton = () => {
    return new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
};

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export { prisma };

if (process.env.NODE_ENV !== 'production') {
    globalThis.prismaGlobal = prisma;
}

/**
 * Database client instance
 * Use this throughout the application instead of creating new PrismaClient instances
 */
export const db = prisma;
