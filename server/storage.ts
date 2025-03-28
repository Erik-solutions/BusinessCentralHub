import { 
  users, type User, type InsertUser,
  customers, type Customer, type InsertCustomer,
  employees, type Employee, type InsertEmployee,
  products, type Product, type InsertProduct,
  tasks, type Task, type InsertTask
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Interface for storage methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Customer methods
  getCustomers(userId: number): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<Customer>): Promise<Customer | undefined>;
  deleteCustomer(id: number): Promise<boolean>;
  
  // Employee methods
  getEmployees(userId: number): Promise<Employee[]>;
  getEmployee(id: number): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: number, employee: Partial<Employee>): Promise<Employee | undefined>;
  deleteEmployee(id: number): Promise<boolean>;
  
  // Product methods
  getProducts(userId: number): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Task methods
  getTasks(userId: number): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private customers: Map<number, Customer>;
  private employees: Map<number, Employee>;
  private products: Map<number, Product>;
  private tasks: Map<number, Task>;
  
  sessionStore: session.SessionStore;
  
  private userIdCounter: number;
  private customerIdCounter: number;
  private employeeIdCounter: number;
  private productIdCounter: number;
  private taskIdCounter: number;

  constructor() {
    this.users = new Map();
    this.customers = new Map();
    this.employees = new Map();
    this.products = new Map();
    this.tasks = new Map();
    
    this.userIdCounter = 1;
    this.customerIdCounter = 1;
    this.employeeIdCounter = 1;
    this.productIdCounter = 1;
    this.taskIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const webLink = userData.webLink || this.generateWebLink(userData.companyName);
    
    const user: User = { 
      ...userData, 
      id, 
      createdAt,
      webLink
    };
    
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Customer methods
  async getCustomers(userId: number): Promise<Customer[]> {
    return Array.from(this.customers.values()).filter(
      (customer) => customer.userId === userId,
    );
  }
  
  async getCustomer(id: number): Promise<Customer | undefined> {
    return this.customers.get(id);
  }
  
  async createCustomer(customerData: InsertCustomer): Promise<Customer> {
    const id = this.customerIdCounter++;
    const createdAt = new Date();
    
    const customer: Customer = { ...customerData, id, createdAt };
    this.customers.set(id, customer);
    return customer;
  }
  
  async updateCustomer(id: number, customerData: Partial<Customer>): Promise<Customer | undefined> {
    const customer = this.customers.get(id);
    if (!customer) return undefined;
    
    const updatedCustomer = { ...customer, ...customerData };
    this.customers.set(id, updatedCustomer);
    return updatedCustomer;
  }
  
  async deleteCustomer(id: number): Promise<boolean> {
    return this.customers.delete(id);
  }
  
  // Employee methods
  async getEmployees(userId: number): Promise<Employee[]> {
    return Array.from(this.employees.values()).filter(
      (employee) => employee.userId === userId,
    );
  }
  
  async getEmployee(id: number): Promise<Employee | undefined> {
    return this.employees.get(id);
  }
  
  async createEmployee(employeeData: InsertEmployee): Promise<Employee> {
    const id = this.employeeIdCounter++;
    
    const employee: Employee = { ...employeeData, id };
    this.employees.set(id, employee);
    return employee;
  }
  
  async updateEmployee(id: number, employeeData: Partial<Employee>): Promise<Employee | undefined> {
    const employee = this.employees.get(id);
    if (!employee) return undefined;
    
    const updatedEmployee = { ...employee, ...employeeData };
    this.employees.set(id, updatedEmployee);
    return updatedEmployee;
  }
  
  async deleteEmployee(id: number): Promise<boolean> {
    return this.employees.delete(id);
  }
  
  // Product methods
  async getProducts(userId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.userId === userId,
    );
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async createProduct(productData: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    
    const product: Product = { ...productData, id };
    this.products.set(id, product);
    return product;
  }
  
  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }
  
  // Task methods
  async getTasks(userId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.userId === userId,
    );
  }
  
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }
  
  async createTask(taskData: InsertTask): Promise<Task> {
    const id = this.taskIdCounter++;
    
    const task: Task = { ...taskData, id };
    this.tasks.set(id, task);
    return task;
  }
  
  async updateTask(id: number, taskData: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...taskData };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }
  
  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }
  
  // Helper method to generate a web link based on company name
  private generateWebLink(companyName: string): string {
    if (!companyName) return '';
    return `bizmanager.com/${companyName.toLowerCase().replace(/\s+/g, '-')}`;
  }
}

export const storage = new MemStorage();
