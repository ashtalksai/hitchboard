import { pgTable, text, timestamp, integer, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const weddings = pgTable("weddings", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  date: timestamp("date"),
  venue: varchar("venue", { length: 500 }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tier: varchar("tier", { length: 20 }).notNull().default("free"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const timelineItems = pgTable("timeline_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  weddingId: uuid("wedding_id").notNull().references(() => weddings.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  time: varchar("time", { length: 10 }).notNull(),
  duration: integer("duration"),
  notes: text("notes"),
  order: integer("order").notNull().default(0),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  weddingId: uuid("wedding_id").notNull().references(() => weddings.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("todo"),
  assignedTo: varchar("assigned_to", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const vendors = pgTable("vendors", {
  id: uuid("id").defaultRandom().primaryKey(),
  weddingId: uuid("wedding_id").notNull().references(() => weddings.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  notes: text("notes"),
});

export const coordinators = pgTable("coordinators", {
  id: uuid("id").defaultRandom().primaryKey(),
  weddingId: uuid("wedding_id").notNull().references(() => weddings.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 100 }),
  invitedAt: timestamp("invited_at").defaultNow().notNull(),
});
