import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | null };

// Only instantiate Prisma if DATABASE_URL is actually configured
function createPrismaClient(): PrismaClient | null {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL === "postgresql://placeholder:placeholder@localhost:5432/placeholder") {
    return null;
  }
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  } catch (e) {
    console.warn("Prisma client failed to initialize:", e);
    return null;
  }
}

export const prisma =
  globalForPrisma.prisma !== undefined
    ? globalForPrisma.prisma
    : createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
