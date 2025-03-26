import { defineConfig } from "drizzle-kit";
import "dotenv/config";


export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  driver: "pglite",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
});


// import { defineConfig } from "drizzle-kit";

// export default defineConfig({
//   schema: "./path/to/your/schema.ts",
//   out: "./migrations",
//   driver: "pg",
//   dbCredentials: {
//     connectionString: process.env.DATABASE_URL,
//   },
// });
