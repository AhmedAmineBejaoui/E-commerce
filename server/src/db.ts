// db.ts
import pg from 'pg';
const { Pool } = pg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "shared/src/schema";


export const pool = new Pool({
  user: 'postgres', // Remplacer par votre utilisateur
  password: 'simplepass',     // Remplacer par votre mot de passe
  host: 'localhost',
  port: 5432,
  database: 'commerce',      // Remplacer par votre base de données
  ssl: false,
  max: 20,
  connectionTimeoutMillis: 5000
});

export const db = drizzle(pool, { schema });