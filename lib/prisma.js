

import { PrismaClient } from "@prisma/client";

// Use global object to avoid multiple Prisma instances in dev
const globalForPrisma = globalThis;

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
     datasourceUrl: process.env.DATABASE_URL,
  });

// Prevent re-initialization on hot reloads in development
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
