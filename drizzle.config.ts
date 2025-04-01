import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './server/src/schema.ts',
  out: './server/src/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: "localhost",
    user: "postgres",
    password:"simplepass",
    database: "commerce",
    ssl: false,
  },
  migrations: {
    table: 'drizzle_migrations',
    schema: 'public'
  }
});