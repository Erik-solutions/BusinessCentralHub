import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  companyName: text("company_name").notNull(),
  businessType: text("business_type"),
  webLink: text("web_link"),
  logo: text("logo"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
  notes: text("notes"),
});

export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  position: text("position"),
  startDate: timestamp("start_date"),
  status: text("status").default("active"),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: text("price"),
  category: text("category"),
  inventory: integer("inventory").default(0),
  image: text("image"),
  isPublished: boolean("is_published").default(false),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  status: text("status").default("pending"),
  priority: text("priority").default("medium"),
  assignedTo: integer("assigned_to"),
  category: text("category"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  companyName: true,
  businessType: true,
  webLink: true,
  logo: true,
});

export const insertCustomerSchema = createInsertSchema(customers).pick({
  userId: true,
  name: true,
  email: true,
  phone: true,
  address: true,
  notes: true,
});

export const insertEmployeeSchema = createInsertSchema(employees).pick({
  userId: true,
  name: true,
  email: true,
  phone: true,
  position: true,
  startDate: true,
  status: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  userId: true,
  name: true,
  description: true,
  price: true,
  category: true,
  inventory: true,
  image: true,
  isPublished: true,
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  userId: true,
  title: true,
  description: true,
  dueDate: true,
  status: true,
  priority: true,
  assignedTo: true,
  category: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;

export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;
