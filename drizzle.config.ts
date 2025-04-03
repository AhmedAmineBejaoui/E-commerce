import { defineConfig } from 'drizzle-kit';
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  schema: "shared/src/schema.ts",
  out: "./server/src/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.PG_HOST || "localhost",
    user: process.env.PG_USER || "postgres",
    password: process.env.PG_PASSWORD || "simplepass",
    database: process.env.PG_DATABASE || "commerce",
    ssl: false,
  },
  migrations: {
    table: 'drizzle_migrations',
    schema: 'public'
  }
});
