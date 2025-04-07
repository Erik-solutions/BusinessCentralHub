// Database schema definitions using Drizzle ORM
import { pgTable, text, serial, integer, boolean, timestamp, json, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table schema - stores core user account information
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  companyName: text("company_name").notNull(),
  businessType: text("business_type"),
  webLink: text("web_link"),
  logo: text("logo"),
  createdAt: timestamp("created_at").defaultNow(),
  about: text("about"),
  contactInfo: text("contact_info"),
  location: text("location"),
});

// Customer/supplier management table
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
  notes: text("notes"),
  type: text("type").default("customer"), // Distinguishes between customers and suppliers
  totalSales: decimal("total_sales").default("0"),
  totalPurchases: decimal("total_purchases").default("0"),
  complaintCount: integer("complaint_count").default(0),
  customerSatisfaction: integer("customer_satisfaction").default(0), // 0-100
});

// Complaint management table
export const complaints = pgTable("complaints", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  customerId: integer("customer_id").references(() => customers.id),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("open"), // open, in-progress, resolved
  priority: text("priority").default("medium"),
  assignedTo: integer("assigned_to").references(() => employees.id),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
  satisfactionRating: integer("satisfaction_rating"), // 0-5
  resolution: text("resolution"),
});

// Department management table
export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  managerId: integer("manager_id"),
  createdAt: timestamp("created_at").defaultNow(),
  managerEmployeeId: integer("manager_employee_id"),
  budget: decimal("budget"),
  goals: json("goals"),
  headcount: integer("headcount"),
});

// Employee management table
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  position: text("position"),
  startDate: timestamp("start_date"),
  status: text("status").default("active"),
  departmentId: integer("department_id").references(() => departments.id),
  permissions: json("permissions").default({}),
  performance: integer("performance").default(0), // 0-100
  salary: decimal("salary"),
  tasksCompleted: integer("tasks_completed").default(0),
  tasksAssigned: integer("tasks_assigned").default(0),
});

// Team management table
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  departmentId: integer("department_id").references(() => departments.id),
  leaderId: integer("leader_id").references(() => employees.id),
  createdAt: timestamp("created_at").defaultNow(),
  goals: json("goals"),
  status: text("status").default("active"),
});

// Team member association table
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  role: text("role"),
  joinedAt: timestamp("joined_at").defaultNow(),
  isActive: boolean("is_active").default(true),
  permissions: json("permissions"),
});

// Product catalog table
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
  sales: integer("sales").default(0),
  revenue: decimal("revenue").default("0"),
  cost: decimal("cost"),
  discount: decimal("discount"),
  promoCode: text("promo_code"),
  socialMediaLinks: json("social_media_links").default({}),
});

// Financial record tracking table
export const financialRecords = pgTable("financial_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // invoice, expense, payment
  amount: decimal("amount").notNull(),
  description: text("description"),
  date: timestamp("date").defaultNow(),
  category: text("category"),
  customerId: integer("customer_id").references(() => customers.id),
  status: text("status").default("pending"), // pending, paid, overdue
  dueDate: timestamp("due_date"),
  reference: text("reference"),
});

// Budget management table
export const budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  amount: decimal("amount").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  category: text("category"),
  departmentId: integer("department_id").references(() => departments.id),
  projectId: integer("project_id").references(() => projects.id),
  actualSpend: decimal("actual_spend").default("0"),
});

// Project management table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  status: text("status").default("planning"), // planning, in-progress, completed
  budget: decimal("budget"),
  teamId: integer("team_id").references(() => teams.id),
  progress: integer("progress").default(0), // 0-100
});

// Meeting scheduling and management table
export const meetings = pgTable("meetings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  duration: integer("duration"), // minutes
  teamId: integer("team_id").references(() => teams.id),
  projectId: integer("project_id").references(() => projects.id),
  status: text("status").default("scheduled"), // scheduled, completed, cancelled
  notes: text("notes"),
});

// Task management table
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
  projectId: integer("project_id").references(() => projects.id),
  teamId: integer("team_id").references(() => teams.id),
  cost: decimal("cost"),
  progress: integer("progress").default(0), // 0-100
  startDate: timestamp("start_date"),
  completedDate: timestamp("completed_date"),
});

// Define types for all schemas
// User schema types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Customer schema types
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;

// Complaint schema types
export type InsertComplaint = z.infer<typeof insertComplaintSchema>;
export type Complaint = typeof complaints.$inferSelect;

// Department schema types
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type Department = typeof departments.$inferSelect;

// Employee schema types
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;

// Team schema types
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;

// Team Member schema types
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;

// Product schema types
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Financial Record schema types
export type InsertFinancialRecord = z.infer<typeof insertFinancialRecordSchema>;
export type FinancialRecord = typeof financialRecords.$inferSelect;

// Budget schema types
export type InsertBudget = z.infer<typeof insertBudgetSchema>;
export type Budget = typeof budgets.$inferSelect;

// Project schema types
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// Meeting schema types
export type InsertMeeting = z.infer<typeof insertMeetingSchema>;
export type Meeting = typeof meetings.$inferSelect;

// Task schema types
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  companyName: true,
  businessType: true,
  webLink: true,
  logo: true,
  about: true,
  contactInfo: true,
  location: true,
});

export const insertCustomerSchema = createInsertSchema(customers).pick({
  userId: true,
  name: true,
  email: true,
  phone: true,
  address: true,
  notes: true,
  type: true,
  totalSales: true,
  totalPurchases: true,
  complaintCount: true,
  customerSatisfaction: true,
});

export const insertComplaintSchema = createInsertSchema(complaints).pick({
  userId: true,
  customerId: true,
  title: true,
  description: true,
  status: true,
  priority: true,
  assignedTo: true,
  resolvedAt: true,
  satisfactionRating: true,
  resolution: true,
});

export const insertDepartmentSchema = createInsertSchema(departments).pick({
  userId: true,
  name: true,
  description: true,
  managerEmployeeId: true,
  budget: true,
  goals: true,
  headcount: true,
}).extend({
  managerId: z.number().optional(),
});

export const insertEmployeeSchema = createInsertSchema(employees).pick({
  userId: true,
  name: true,
  email: true,
  phone: true,
  position: true,
  startDate: true,
  status: true,
  departmentId: true,
  permissions: true,
  salary: true,
  performance: true,
  tasksCompleted: true,
  tasksAssigned: true,
});

export const insertTeamSchema = createInsertSchema(teams).pick({
  userId: true,
  name: true,
  description: true,
  departmentId: true,
  leaderId: true,
  goals: true,
  status: true,
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).pick({
  teamId: true,
  employeeId: true,
  role: true,
  isActive: true,
  permissions: true,
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
  cost: true,
  discount: true,
  promoCode: true,
  socialMediaLinks: true,
  sales: true,
  revenue: true,
}).extend({
  popularity: z.number().optional(),
});

export const insertFinancialRecordSchema = createInsertSchema(financialRecords).pick({
  userId: true,
  type: true,
  amount: true,
  description: true,
  date: true,
  category: true,
  customerId: true,
  status: true,
  dueDate: true,
  reference: true,
}).extend({
  relatedEntityId: z.number().optional(),
  relatedEntityType: z.string().optional(),
  taxDeductible: z.boolean().optional(),
});

export const insertBudgetSchema = createInsertSchema(budgets).pick({
  userId: true,
  name: true,
  amount: true,
  startDate: true,
  endDate: true,
  category: true,
  departmentId: true,
  projectId: true,
  actualSpend: true,
}).extend({
  period: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  userId: true,
  name: true,
  description: true,
  startDate: true,
  endDate: true,
  status: true,
  budget: true,
  teamId: true,
  progress: true,
}).extend({
  priority: z.string().optional(),
  completedAt: z.date().optional(),
});

export const insertMeetingSchema = createInsertSchema(meetings).pick({
  userId: true,
  title: true,
  description: true,
  date: true,
  duration: true,
  teamId: true,
  projectId: true,
  status: true,
  notes: true,
}).extend({
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  location: z.string().optional(),
  agenda: z.string().optional(),
  attendees: z.array(z.number()).optional(),
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
  projectId: true,
  teamId: true,
  cost: true,
  startDate: true,
  progress: true,
  completedDate: true,
});