import {
  boolean,
  timestamp,
  text,
  primaryKey,
  integer,
  pgTableCreator,
  jsonb,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"
import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import type { AdapterAccountType } from "@auth/core/adapters"
import { relations } from "drizzle-orm";

const connectionString = process.env.AUTH_DRIZZLE_URL!;
const pool = postgres(connectionString, { max: 1 })

export const db = drizzle(pool)

const pgTable = pgTableCreator((name) => `devtools_${name}`);

// NEXTAUTH TABLES 
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
})

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
)

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
)

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
)

// Board Tables
// BOARDS TABLE
export const boards = pgTable("boards", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// TASKS TABLE
export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  boardId: uuid("board_id")
    .notNull()
    .references(() => boards.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  position: integer("position").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  // Link to custom status
  statusId: uuid("status_id")
    .references(() => taskStatuses.id, { onDelete: "set null" }),
});

export const taskStatuses = pgTable("task_statuses", {
  id: uuid("id").defaultRandom().primaryKey(),
  boardId: uuid("board_id")
    .notNull()
    .references(() => boards.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(), // e.g. "To Do", "In Progress", "Done"
  color: varchar("color", { length: 20 }), // optional, for UI labels (e.g. "blue", "#22c55e")
  position: integer("position").default(0).notNull(), // order in the board
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// CUSTOM FIELD DEFINITIONS PER BOARD
export const customFields = pgTable("custom_fields", {
  id: uuid("id").defaultRandom().primaryKey(),
  boardId: uuid("board_id")
    .notNull()
    .references(() => boards.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(), // e.g. "Priority", "Due Date"
  type: varchar("type", { length: 50 }).notNull(), // e.g. "text", "number", "date", "select"
  options: jsonb("options"), // for "select" or "multiselect" field types
  required: integer("required").default(0), // 0 = false, 1 = true
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// VALUES OF CUSTOM FIELDS PER TASK
export const taskCustomFieldValues = pgTable(
  "task_custom_field_values",
  {
    taskId: uuid("task_id")
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),
    fieldId: uuid("field_id")
      .notNull()
      .references(() => customFields.id, { onDelete: "cascade" }),
    value: jsonb("value").notNull(), // flexible: could be text, number, array, etc.
  },
  (table) => [
    {
      pk: primaryKey({
        columns: [table.taskId, table.fieldId],
      }),
    },
  ]
);

//
// RELATIONS (optional, for Drizzle’s relational API)
//
export const usersRelations = relations(users, ({ many }) => ({
  boards: many(boards),
}));

export const boardsRelations = relations(boards, ({ many, one }) => ({
  owner: one(users, {
    fields: [boards.ownerId],
    references: [users.id],
  }),
  tasks: many(tasks),
  customFields: many(customFields),
}));

export const tasksRelations = relations(tasks, ({ many, one }) => ({
  board: one(boards, {
    fields: [tasks.boardId],
    references: [boards.id],
  }),
  status: one(taskStatuses, {
    fields: [tasks.statusId],
    references: [taskStatuses.id],
  }),
  customFieldValues: many(taskCustomFieldValues),
}));

export const customFieldsRelations = relations(customFields, ({ one, many }) => ({
  board: one(boards, {
    fields: [customFields.boardId],
    references: [boards.id],
  }),
  values: many(taskCustomFieldValues),
}));

export const taskCustomFieldValuesRelations = relations(taskCustomFieldValues, ({ one }) => ({
  task: one(tasks, {
    fields: [taskCustomFieldValues.taskId],
    references: [tasks.id],
  }),
  field: one(customFields, {
    fields: [taskCustomFieldValues.fieldId],
    references: [customFields.id],
  }),
}));

export const taskStatusesRelations = relations(taskStatuses, ({ one, many }) => ({
  board: one(boards, {
    fields: [taskStatuses.boardId],
    references: [boards.id],
  }),
  tasks: many(tasks),
}));





