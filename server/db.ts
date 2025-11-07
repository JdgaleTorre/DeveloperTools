import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";


// ✅ Use a singleton pattern like Prisma to avoid multiple connections in dev
const globalForDb = globalThis as unknown as {
  conn: ReturnType<typeof postgres> | undefined;
  db: ReturnType<typeof drizzle> | undefined;
};

const connectionString = process.env.DB_POSTGRES_URL!; // your DATABASE_URL equivalent

// Only create a new connection if not already present (important for Next.js hot reload)
const conn =
  globalForDb.conn ??
  postgres(connectionString, {
    max: 1, // limit to 1 connection for edge/development
  });

export const db =
  globalForDb.db ?? drizzle(conn);

// Store the connection globally in dev mode
if (process.env.NODE_ENV !== "production") {
  globalForDb.conn = conn;
  globalForDb.db = db;
}
