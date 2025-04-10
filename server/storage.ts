import { 
  users, type User, type InsertUser,
  customers, type Customer, type InsertCustomer,
  employees, type Employee, type InsertEmployee,
  products, type Product, type InsertProduct,
  tasks, type Task, type InsertTask,
  departments, type Department, type InsertDepartment,
  teams, type Team, type InsertTeam,
  teamMembers, type TeamMember, type InsertTeamMember,
  complaints, type Complaint, type InsertComplaint,
  financialRecords, type FinancialRecord, type InsertFinancialRecord,
  budgets, type Budget, type InsertBudget,
  projects, type Project, type InsertProject,
  meetings, type Meeting, type InsertMeeting
} from "@shared/schema";

// Interface for storage methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Customer methods
  getCustomers(userId: number, type?: string): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<Customer>): Promise<Customer | undefined>;
  deleteCustomer(id: number): Promise<boolean>;
  
  // Complaint methods
  getComplaints(userId: number, customerId?: number): Promise<Complaint[]>;
  getComplaint(id: number): Promise<Complaint | undefined>;
  createComplaint(complaint: InsertComplaint): Promise<Complaint>;
  updateComplaint(id: number, complaint: Partial<Complaint>): Promise<Complaint | undefined>;
  deleteComplaint(id: number): Promise<boolean>;
  
  // Department methods
  getDepartments(userId: number): Promise<Department[]>;
  getDepartment(id: number): Promise<Department | undefined>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  updateDepartment(id: number, department: Partial<Department>): Promise<Department | undefined>;
  deleteDepartment(id: number): Promise<boolean>;
  
  // Employee methods
  getEmployees(userId: number, departmentId?: number): Promise<Employee[]>;
  getEmployee(id: number): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: number, employee: Partial<Employee>): Promise<Employee | undefined>;
  deleteEmployee(id: number): Promise<boolean>;
  getTopPerformingEmployees(userId: number, limit?: number): Promise<Employee[]>;
  
  // Team methods
  getTeams(userId: number, departmentId?: number): Promise<Team[]>;
  getTeam(id: number): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: number, team: Partial<Team>): Promise<Team | undefined>;
  deleteTeam(id: number): Promise<boolean>;
  
  // Team member methods
  getTeamMembers(teamId: number): Promise<TeamMember[]>;
  getTeamMember(id: number): Promise<TeamMember | undefined>;
  createTeamMember(teamMember: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: number, teamMember: Partial<TeamMember>): Promise<TeamMember | undefined>;
  deleteTeamMember(id: number): Promise<boolean>;
  
  // Product methods
  getProducts(userId: number): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  getTopProducts(userId: number, limit?: number): Promise<Product[]>;
  
  // Financial record methods
  getFinancialRecords(userId: number, type?: string): Promise<FinancialRecord[]>;
  getFinancialRecord(id: number): Promise<FinancialRecord | undefined>;
  createFinancialRecord(financialRecord: InsertFinancialRecord): Promise<FinancialRecord>;
  updateFinancialRecord(id: number, financialRecord: Partial<FinancialRecord>): Promise<FinancialRecord | undefined>;
  deleteFinancialRecord(id: number): Promise<boolean>;
  
  // Budget methods
  getBudgets(userId: number, departmentId?: number, projectId?: number): Promise<Budget[]>;
  getBudget(id: number): Promise<Budget | undefined>;
  createBudget(budget: InsertBudget): Promise<Budget>;
  updateBudget(id: number, budget: Partial<Budget>): Promise<Budget | undefined>;
  deleteBudget(id: number): Promise<boolean>;
  
  // Project methods
  getProjects(userId: number, teamId?: number): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Meeting methods
  getMeetings(userId: number, teamId?: number, projectId?: number): Promise<Meeting[]>;
  getMeeting(id: number): Promise<Meeting | undefined>;
  createMeeting(meeting: InsertMeeting): Promise<Meeting>;
  updateMeeting(id: number, meeting: Partial<Meeting>): Promise<Meeting | undefined>;
  deleteMeeting(id: number): Promise<boolean>;
  
  // Task methods
  getTasks(userId: number, assignedTo?: number, teamId?: number, projectId?: number): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: any; // Using any because of type issues with session store
}

// Import the DatabaseStorage from our implementation file
import { DatabaseStorage } from './storage-db';

// Use database storage
export const storage = new DatabaseStorage();