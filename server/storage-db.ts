import { db } from "./db";
import { users, customers, complaints, departments, employees, teams, 
  teamMembers, products, financialRecords, budgets, projects, meetings, tasks,
  type User, type InsertUser, type Customer, type InsertCustomer, 
  type Complaint, type InsertComplaint, type Department, type InsertDepartment, 
  type Employee, type InsertEmployee, type Team, type InsertTeam, 
  type TeamMember, type InsertTeamMember, type Product, type InsertProduct, 
  type FinancialRecord, type InsertFinancialRecord, type Budget, type InsertBudget, 
  type Project, type InsertProject, type Meeting, type InsertMeeting, 
  type Task, type InsertTask
} from "@shared/schema";
import { eq, and, or, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import pg from "pg";

// PostgreSQL store for session
const PostgresSessionStore = connectPg(session);

// Storage interface implementation using PostgreSQL database
export class DatabaseStorage {
  sessionStore: session.Store;
  
  constructor() {
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
    });
    
    this.sessionStore = new PostgresSessionStore({
      pool, 
      createTableIfMissing: true
    });
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }
  
  // Customer methods
  async getCustomers(userId: number, type?: string): Promise<Customer[]> {
    if (type) {
      return db
        .select()
        .from(customers)
        .where(and(eq(customers.userId, userId), eq(customers.type, type)));
    }
    return db.select().from(customers).where(eq(customers.userId, userId));
  }
  
  async getCustomer(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer || undefined;
  }
  
  async createCustomer(customerData: InsertCustomer): Promise<Customer> {
    const [customer] = await db
      .insert(customers)
      .values(customerData)
      .returning();
    return customer;
  }
  
  async updateCustomer(id: number, customerData: Partial<Customer>): Promise<Customer | undefined> {
    const [customer] = await db
      .update(customers)
      .set(customerData)
      .where(eq(customers.id, id))
      .returning();
    return customer || undefined;
  }
  
  async deleteCustomer(id: number): Promise<boolean> {
    const result = await db
      .delete(customers)
      .where(eq(customers.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Employee methods
  async getEmployees(userId: number, departmentId?: number): Promise<Employee[]> {
    if (departmentId) {
      return db
        .select()
        .from(employees)
        .where(and(eq(employees.userId, userId), eq(employees.departmentId, departmentId)));
    }
    return db.select().from(employees).where(eq(employees.userId, userId));
  }
  
  async getEmployee(id: number): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.id, id));
    return employee || undefined;
  }
  
  async createEmployee(employeeData: InsertEmployee): Promise<Employee> {
    const [employee] = await db
      .insert(employees)
      .values(employeeData)
      .returning();
    return employee;
  }
  
  async updateEmployee(id: number, employeeData: Partial<Employee>): Promise<Employee | undefined> {
    const [employee] = await db
      .update(employees)
      .set(employeeData)
      .where(eq(employees.id, id))
      .returning();
    return employee || undefined;
  }
  
  async deleteEmployee(id: number): Promise<boolean> {
    const result = await db
      .delete(employees)
      .where(eq(employees.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  // Product methods
  async getProducts(userId: number): Promise<Product[]> {
    return db.select().from(products).where(eq(products.userId, userId));
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }
  
  async createProduct(productData: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(productData)
      .returning();
    return product;
  }
  
  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set(productData)
      .where(eq(products.id, id))
      .returning();
    return product || undefined;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    const result = await db
      .delete(products)
      .where(eq(products.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  // Task methods
  async getTasks(userId: number, assignedTo?: number, teamId?: number, projectId?: number): Promise<Task[]> {
    let conditions = [eq(tasks.userId, userId)];
    
    if (assignedTo !== undefined) {
      conditions.push(eq(tasks.assignedTo, assignedTo));
    }
    
    if (teamId !== undefined) {
      conditions.push(eq(tasks.teamId, teamId));
    }
    
    if (projectId !== undefined) {
      conditions.push(eq(tasks.projectId, projectId));
    }
    
    return db.select().from(tasks).where(and(...conditions));
  }
  
  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || undefined;
  }
  
  async createTask(taskData: InsertTask): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values(taskData)
      .returning();
    return task;
  }
  
  async updateTask(id: number, taskData: Partial<Task>): Promise<Task | undefined> {
    const [task] = await db
      .update(tasks)
      .set(taskData)
      .where(eq(tasks.id, id))
      .returning();
    return task || undefined;
  }
  
  async deleteTask(id: number): Promise<boolean> {
    const result = await db
      .delete(tasks)
      .where(eq(tasks.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  // Complaint methods
  async getComplaints(userId: number, customerId?: number): Promise<Complaint[]> {
    if (customerId) {
      return db
        .select()
        .from(complaints)
        .where(and(eq(complaints.userId, userId), eq(complaints.customerId, customerId)));
    }
    return db.select().from(complaints).where(eq(complaints.userId, userId));
  }
  
  async getComplaint(id: number): Promise<Complaint | undefined> {
    const [complaint] = await db.select().from(complaints).where(eq(complaints.id, id));
    return complaint || undefined;
  }
  
  async createComplaint(complaintData: InsertComplaint): Promise<Complaint> {
    const [complaint] = await db
      .insert(complaints)
      .values(complaintData)
      .returning();
    return complaint;
  }
  
  async updateComplaint(id: number, complaintData: Partial<Complaint>): Promise<Complaint | undefined> {
    const [complaint] = await db
      .update(complaints)
      .set(complaintData)
      .where(eq(complaints.id, id))
      .returning();
    return complaint || undefined;
  }
  
  async deleteComplaint(id: number): Promise<boolean> {
    const result = await db
      .delete(complaints)
      .where(eq(complaints.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  // Department methods
  async getDepartments(userId: number): Promise<Department[]> {
    return db.select().from(departments).where(eq(departments.userId, userId));
  }
  
  async getDepartment(id: number): Promise<Department | undefined> {
    const [department] = await db.select().from(departments).where(eq(departments.id, id));
    return department || undefined;
  }
  
  async createDepartment(departmentData: InsertDepartment): Promise<Department> {
    const [department] = await db
      .insert(departments)
      .values(departmentData)
      .returning();
    return department;
  }
  
  async updateDepartment(id: number, departmentData: Partial<Department>): Promise<Department | undefined> {
    const [department] = await db
      .update(departments)
      .set(departmentData)
      .where(eq(departments.id, id))
      .returning();
    return department || undefined;
  }
  
  async deleteDepartment(id: number): Promise<boolean> {
    const result = await db
      .delete(departments)
      .where(eq(departments.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  // Team methods
  async getTeams(userId: number, departmentId?: number): Promise<Team[]> {
    if (departmentId) {
      return db
        .select()
        .from(teams)
        .where(and(eq(teams.userId, userId), eq(teams.departmentId, departmentId)));
    }
    return db.select().from(teams).where(eq(teams.userId, userId));
  }
  
  async getTeam(id: number): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team || undefined;
  }
  
  async createTeam(teamData: InsertTeam): Promise<Team> {
    const [team] = await db
      .insert(teams)
      .values(teamData)
      .returning();
    return team;
  }
  
  async updateTeam(id: number, teamData: Partial<Team>): Promise<Team | undefined> {
    const [team] = await db
      .update(teams)
      .set(teamData)
      .where(eq(teams.id, id))
      .returning();
    return team || undefined;
  }
  
  async deleteTeam(id: number): Promise<boolean> {
    const result = await db
      .delete(teams)
      .where(eq(teams.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  // Team member methods
  async getTeamMembers(teamId: number): Promise<TeamMember[]> {
    return db.select().from(teamMembers).where(eq(teamMembers.teamId, teamId));
  }
  
  async getTeamMember(id: number): Promise<TeamMember | undefined> {
    const [teamMember] = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
    return teamMember || undefined;
  }
  
  async createTeamMember(teamMemberData: InsertTeamMember): Promise<TeamMember> {
    const [teamMember] = await db
      .insert(teamMembers)
      .values(teamMemberData)
      .returning();
    return teamMember;
  }
  
  async updateTeamMember(id: number, teamMemberData: Partial<TeamMember>): Promise<TeamMember | undefined> {
    const [teamMember] = await db
      .update(teamMembers)
      .set(teamMemberData)
      .where(eq(teamMembers.id, id))
      .returning();
    return teamMember || undefined;
  }
  
  async deleteTeamMember(id: number): Promise<boolean> {
    const result = await db
      .delete(teamMembers)
      .where(eq(teamMembers.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  // Financial record methods
  async getFinancialRecords(userId: number, type?: string): Promise<FinancialRecord[]> {
    if (type) {
      return db
        .select()
        .from(financialRecords)
        .where(and(eq(financialRecords.userId, userId), eq(financialRecords.type, type)));
    }
    return db.select().from(financialRecords).where(eq(financialRecords.userId, userId));
  }
  
  async getFinancialRecord(id: number): Promise<FinancialRecord | undefined> {
    const [record] = await db.select().from(financialRecords).where(eq(financialRecords.id, id));
    return record || undefined;
  }
  
  async createFinancialRecord(recordData: InsertFinancialRecord): Promise<FinancialRecord> {
    const [record] = await db
      .insert(financialRecords)
      .values(recordData)
      .returning();
    return record;
  }
  
  async updateFinancialRecord(id: number, recordData: Partial<FinancialRecord>): Promise<FinancialRecord | undefined> {
    const [record] = await db
      .update(financialRecords)
      .set(recordData)
      .where(eq(financialRecords.id, id))
      .returning();
    return record || undefined;
  }
  
  async deleteFinancialRecord(id: number): Promise<boolean> {
    const result = await db
      .delete(financialRecords)
      .where(eq(financialRecords.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  // Budget methods
  async getBudgets(userId: number, departmentId?: number, projectId?: number): Promise<Budget[]> {
    let conditions = [eq(budgets.userId, userId)];
    
    if (departmentId !== undefined) {
      conditions.push(eq(budgets.departmentId, departmentId));
    }
    
    if (projectId !== undefined) {
      conditions.push(eq(budgets.projectId, projectId));
    }
    
    return db.select().from(budgets).where(and(...conditions));
  }
  
  async getBudget(id: number): Promise<Budget | undefined> {
    const [budget] = await db.select().from(budgets).where(eq(budgets.id, id));
    return budget || undefined;
  }
  
  async createBudget(budgetData: InsertBudget): Promise<Budget> {
    const [budget] = await db
      .insert(budgets)
      .values(budgetData)
      .returning();
    return budget;
  }
  
  async updateBudget(id: number, budgetData: Partial<Budget>): Promise<Budget | undefined> {
    const [budget] = await db
      .update(budgets)
      .set(budgetData)
      .where(eq(budgets.id, id))
      .returning();
    return budget || undefined;
  }
  
  async deleteBudget(id: number): Promise<boolean> {
    const result = await db
      .delete(budgets)
      .where(eq(budgets.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  // Project methods
  async getProjects(userId: number, teamId?: number): Promise<Project[]> {
    if (teamId) {
      return db
        .select()
        .from(projects)
        .where(and(eq(projects.userId, userId), eq(projects.teamId, teamId)));
    }
    return db.select().from(projects).where(eq(projects.userId, userId));
  }
  
  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }
  
  async createProject(projectData: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(projectData)
      .returning();
    return project;
  }
  
  async updateProject(id: number, projectData: Partial<Project>): Promise<Project | undefined> {
    const [project] = await db
      .update(projects)
      .set(projectData)
      .where(eq(projects.id, id))
      .returning();
    return project || undefined;
  }
  
  async deleteProject(id: number): Promise<boolean> {
    const result = await db
      .delete(projects)
      .where(eq(projects.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  // Meeting methods
  async getMeetings(userId: number, teamId?: number, projectId?: number): Promise<Meeting[]> {
    let conditions = [eq(meetings.userId, userId)];
    
    if (teamId !== undefined) {
      conditions.push(eq(meetings.teamId, teamId));
    }
    
    if (projectId !== undefined) {
      conditions.push(eq(meetings.projectId, projectId));
    }
    
    return db.select().from(meetings).where(and(...conditions));
  }
  
  async getMeeting(id: number): Promise<Meeting | undefined> {
    const [meeting] = await db.select().from(meetings).where(eq(meetings.id, id));
    return meeting || undefined;
  }
  
  async createMeeting(meetingData: InsertMeeting): Promise<Meeting> {
    const [meeting] = await db
      .insert(meetings)
      .values(meetingData)
      .returning();
    return meeting;
  }
  
  async updateMeeting(id: number, meetingData: Partial<Meeting>): Promise<Meeting | undefined> {
    const [meeting] = await db
      .update(meetings)
      .set(meetingData)
      .where(eq(meetings.id, id))
      .returning();
    return meeting || undefined;
  }
  
  async deleteMeeting(id: number): Promise<boolean> {
    const result = await db
      .delete(meetings)
      .where(eq(meetings.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  // Top performing employees and products
  async getTopPerformingEmployees(userId: number, limit: number = 5): Promise<Employee[]> {
    return db
      .select()
      .from(employees)
      .where(eq(employees.userId, userId))
      .orderBy(employees.performance)
      .limit(limit);
  }
  
  async getTopProducts(userId: number, limit: number = 5): Promise<Product[]> {
    return db
      .select()
      .from(products)
      .where(eq(products.userId, userId))
      .orderBy(products.sales)
      .limit(limit);
  }
}