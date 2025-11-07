import 'dotenv/config';
import { defineConfig } from "drizzle-kit";

const url =
  process.env.NODE_ENV === 'production' ? process.env.DB_POSTGRES_URL : process.env.LOCAL_POSTGRES_URL;

console.log("Using environment:", process.env.NODE_ENV);
console.log("Using database URL:", url);

if (!url)
  throw new Error(
    `Connection string to ${process.env.NODE_ENV ? 'Neon' : 'local'} Postgres not found.`
  );

export default defineConfig({
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./app/schema.ts",
  dbCredentials: {
    url
  },

  extensionsFilters: ["postgis"],
  schemaFilter: "public",
  tablesFilter: "devtools_*",

  introspect: {
    casing: "camel",
  },

  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations__",
    schema: "public",
  },

  breakpoints: true,
  strict: true,
  verbose: true,
});
