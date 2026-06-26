import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use process.env so `prisma generate` succeeds during Vercel install
    // even when DATABASE_URL / DIRECT_URL are not yet available.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
    directUrl: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
