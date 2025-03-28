import pg from 'pg';
const { Pool } = pg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
  connectionTimeoutMillis: 5000,
  options: `--client_encoding=UTF8 --auth-method=scram-sha-256`
});

export const db = drizzle(pool, { schema });