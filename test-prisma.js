const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function testConnection() {
  try {
    await db.$connect();
    console.log("✅ Prisma connected successfully");
  } catch (err) {
    console.error("❌ Prisma connection failed:", err);
  } finally {
    await db.$disconnect();
  }
}

testConnection();
