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
  sessionStore: any; // Using any because of type issues with memorystore
}

export class MemStorage implements IStorage {
  // Maps to store all entity data
  private users: Map<number, User>;
  private customers: Map<number, Customer>;
  private employees: Map<number, Employee>;
  private products: Map<number, Product>;
  private tasks: Map<number, Task>;
  private complaints: Map<number, Complaint>;
  private departments: Map<number, Department>;
  private teams: Map<number, Team>;
  private teamMembers: Map<number, TeamMember>;
  private financialRecords: Map<number, FinancialRecord>;
  private budgets: Map<number, Budget>;
  private projects: Map<number, Project>;
  private meetings: Map<number, Meeting>;
  
  sessionStore: any; // Using any for session store type issues
  
  // ID counters for each entity
  private userIdCounter: number;
  private customerIdCounter: number;
  private employeeIdCounter: number;
  private productIdCounter: number;
  private taskIdCounter: number;
  private complaintIdCounter: number;
  private departmentIdCounter: number;
  private teamIdCounter: number;
  private teamMemberIdCounter: number;
  private financialRecordIdCounter: number;
  private budgetIdCounter: number;
  private projectIdCounter: number;
  private meetingIdCounter: number;

  constructor() {
    // Initialize Maps
    this.users = new Map();
    this.customers = new Map();
    this.employees = new Map();
    this.products = new Map();
    this.tasks = new Map();
    this.complaints = new Map();
    this.departments = new Map();
    this.teams = new Map();
    this.teamMembers = new Map();
    this.financialRecords = new Map();
    this.budgets = new Map();
    this.projects = new Map();
    this.meetings = new Map();
    
    // Initialize ID counters
    this.userIdCounter = 1;
    this.customerIdCounter = 1;
    this.employeeIdCounter = 1;
    this.productIdCounter = 1;
    this.taskIdCounter = 1;
    this.complaintIdCounter = 1;
    this.departmentIdCounter = 1;
    this.teamIdCounter = 1;
    this.teamMemberIdCounter = 1;
    this.financialRecordIdCounter = 1;
    this.budgetIdCounter = 1;
    this.projectIdCounter = 1;
    this.meetingIdCounter = 1;
    
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
      id,
      username: userData.username, 
      password: userData.password,
      companyName: userData.companyName,
      businessType: userData.businessType || null,
      webLink: webLink || null,
      logo: userData.logo || null,
      createdAt,
      about: userData.about || null,
      contactInfo: userData.contactInfo || null,
      location: userData.location || null
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
    
    const customer: Customer = { 
      id, 
      userId: customerData.userId,
      name: customerData.name,
      type: customerData.type || null,
      email: customerData.email || null,
      phone: customerData.phone || null,
      address: customerData.address || null,
      notes: customerData.notes || null,
      createdAt: createdAt,
      totalSales: customerData.totalSales || null,
      totalPurchases: customerData.totalPurchases || null,
      complaintCount: customerData.complaintCount || null,
      customerSatisfaction: customerData.customerSatisfaction || null
    };
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
    
    const employee: Employee = { 
      id,
      userId: employeeData.userId,
      name: employeeData.name,
      email: employeeData.email || null,
      phone: employeeData.phone || null,
      position: employeeData.position || null,
      startDate: employeeData.startDate || null,
      status: employeeData.status || null,
      departmentId: employeeData.departmentId || null,
      permissions: employeeData.permissions || null,
      performance: employeeData.performance || null,
      salary: employeeData.salary || null,
      tasksCompleted: employeeData.tasksCompleted || null,
      tasksAssigned: employeeData.tasksAssigned || null
    };
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
    
    const product: Product = { 
      id,
      userId: productData.userId,
      name: productData.name,
      description: productData.description || null,
      price: productData.price || null,
      category: productData.category || null,
      inventory: productData.inventory || null,
      image: productData.image || null,
      isPublished: productData.isPublished || null,
      sales: productData.sales || null,
      revenue: productData.revenue || null,
      cost: productData.cost || null,
      discount: productData.discount || null,
      popularity: productData.popularity || null,
      socialMediaLinks: productData.socialMediaLinks || null
    };
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
  async getTasks(userId: number, assignedTo?: number, teamId?: number, projectId?: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => {
        // Base filter by userId
        if (task.userId !== userId) return false;
        
        // Apply optional filters if provided
        if (assignedTo !== undefined && task.assignedTo !== assignedTo) return false;
        if (teamId !== undefined && task.teamId !== teamId) return false;
        if (projectId !== undefined && task.projectId !== projectId) return false;
        
        // Task matches all criteria
        return true;
      }
    );
  }
  
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }
  
  async createTask(taskData: InsertTask): Promise<Task> {
    const id = this.taskIdCounter++;
    
    const task: Task = { 
      id,
      userId: taskData.userId,
      title: taskData.title,
      description: taskData.description || null,
      dueDate: taskData.dueDate || null,
      status: taskData.status || null,
      priority: taskData.priority || null,
      assignedTo: taskData.assignedTo || null,
      category: taskData.category || null,
      startDate: taskData.startDate || null,
      teamId: taskData.teamId || null,
      cost: taskData.cost || null,
      progress: taskData.progress || null,
      projectId: taskData.projectId || null,
      completedDate: taskData.completedDate || null
    };
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
  
  // Complaint methods
  async getComplaints(userId: number, customerId?: number): Promise<Complaint[]> {
    return Array.from(this.complaints.values()).filter(
      (complaint) => {
        if (customerId) {
          return complaint.userId === userId && complaint.customerId === customerId;
        }
        return complaint.userId === userId;
      }
    );
  }
  
  async getComplaint(id: number): Promise<Complaint | undefined> {
    return this.complaints.get(id);
  }
  
  async createComplaint(complaintData: InsertComplaint): Promise<Complaint> {
    const id = this.complaintIdCounter++;
    const createdAt = new Date();
    
    const complaint: Complaint = { 
      id, 
      userId: complaintData.userId,
      customerId: complaintData.customerId,
      title: complaintData.title,
      description: complaintData.description || null,
      status: complaintData.status || null,
      priority: complaintData.priority || null,
      createdAt,
      resolvedAt: complaintData.resolvedAt || null,
      assignedTo: complaintData.assignedTo || null,
      resolution: complaintData.resolution || null
    };
    this.complaints.set(id, complaint);
    return complaint;
  }
  
  async updateComplaint(id: number, complaintData: Partial<Complaint>): Promise<Complaint | undefined> {
    const complaint = this.complaints.get(id);
    if (!complaint) return undefined;
    
    const updatedComplaint = { ...complaint, ...complaintData };
    this.complaints.set(id, updatedComplaint);
    return updatedComplaint;
  }
  
  async deleteComplaint(id: number): Promise<boolean> {
    return this.complaints.delete(id);
  }

  // Department methods
  async getDepartments(userId: number): Promise<Department[]> {
    return Array.from(this.departments.values()).filter(
      (department) => department.userId === userId
    );
  }
  
  async getDepartment(id: number): Promise<Department | undefined> {
    return this.departments.get(id);
  }
  
  async createDepartment(departmentData: InsertDepartment): Promise<Department> {
    const id = this.departmentIdCounter++;
    const createdAt = new Date();
    
    const department: Department = { 
      id, 
      userId: departmentData.userId,
      name: departmentData.name,
      description: departmentData.description || null,
      createdAt,
      managerEmployeeId: departmentData.managerEmployeeId || null,
      budget: departmentData.budget || null,
      goals: departmentData.goals || null,
      headcount: departmentData.headcount || null
    };
    this.departments.set(id, department);
    return department;
  }
  
  async updateDepartment(id: number, departmentData: Partial<Department>): Promise<Department | undefined> {
    const department = this.departments.get(id);
    if (!department) return undefined;
    
    const updatedDepartment = { ...department, ...departmentData };
    this.departments.set(id, updatedDepartment);
    return updatedDepartment;
  }
  
  async deleteDepartment(id: number): Promise<boolean> {
    return this.departments.delete(id);
  }

  // Team methods
  async getTeams(userId: number, departmentId?: number): Promise<Team[]> {
    return Array.from(this.teams.values()).filter(
      (team) => {
        if (departmentId) {
          return team.userId === userId && team.departmentId === departmentId;
        }
        return team.userId === userId;
      }
    );
  }
  
  async getTeam(id: number): Promise<Team | undefined> {
    return this.teams.get(id);
  }
  
  async createTeam(teamData: InsertTeam): Promise<Team> {
    const id = this.teamIdCounter++;
    const createdAt = new Date();
    
    const team: Team = { 
      id, 
      userId: teamData.userId,
      name: teamData.name,
      departmentId: teamData.departmentId || null,
      description: teamData.description || null,
      createdAt,
      leaderId: teamData.leaderId || null,
      goals: teamData.goals || null,
      status: teamData.status || null
    };
    this.teams.set(id, team);
    return team;
  }
  
  async updateTeam(id: number, teamData: Partial<Team>): Promise<Team | undefined> {
    const team = this.teams.get(id);
    if (!team) return undefined;
    
    const updatedTeam = { ...team, ...teamData };
    this.teams.set(id, updatedTeam);
    return updatedTeam;
  }
  
  async deleteTeam(id: number): Promise<boolean> {
    return this.teams.delete(id);
  }

  // Team member methods
  async getTeamMembers(teamId: number): Promise<TeamMember[]> {
    return Array.from(this.teamMembers.values()).filter(
      (teamMember) => teamMember.teamId === teamId
    );
  }
  
  async getTeamMember(id: number): Promise<TeamMember | undefined> {
    return this.teamMembers.get(id);
  }
  
  async createTeamMember(teamMemberData: InsertTeamMember): Promise<TeamMember> {
    const id = this.teamMemberIdCounter++;
    const joinedAt = new Date();
    
    const teamMember: TeamMember = { 
      id, 
      teamId: teamMemberData.teamId,
      employeeId: teamMemberData.employeeId,
      role: teamMemberData.role || null,
      joinedAt,
      isActive: teamMemberData.isActive !== undefined ? teamMemberData.isActive : true,
      permissions: teamMemberData.permissions || null
    };
    this.teamMembers.set(id, teamMember);
    return teamMember;
  }
  
  async updateTeamMember(id: number, teamMemberData: Partial<TeamMember>): Promise<TeamMember | undefined> {
    const teamMember = this.teamMembers.get(id);
    if (!teamMember) return undefined;
    
    const updatedTeamMember = { ...teamMember, ...teamMemberData };
    this.teamMembers.set(id, updatedTeamMember);
    return updatedTeamMember;
  }
  
  async deleteTeamMember(id: number): Promise<boolean> {
    return this.teamMembers.delete(id);
  }

  // Financial record methods
  async getFinancialRecords(userId: number, type?: string): Promise<FinancialRecord[]> {
    return Array.from(this.financialRecords.values()).filter(
      (record) => {
        if (type) {
          return record.userId === userId && record.type === type;
        }
        return record.userId === userId;
      }
    );
  }
  
  async getFinancialRecord(id: number): Promise<FinancialRecord | undefined> {
    return this.financialRecords.get(id);
  }
  
  async createFinancialRecord(recordData: InsertFinancialRecord): Promise<FinancialRecord> {
    const id = this.financialRecordIdCounter++;
    const date = recordData.date || new Date();
    
    const record: FinancialRecord = { 
      id, 
      userId: recordData.userId,
      type: recordData.type,
      amount: recordData.amount,
      date,
      description: recordData.description || null,
      category: recordData.category || null,
      status: recordData.status || null,
      relatedEntityId: recordData.relatedEntityId || null,
      relatedEntityType: recordData.relatedEntityType || null,
      taxDeductible: recordData.taxDeductible || null
    };
    this.financialRecords.set(id, record);
    return record;
  }
  
  async updateFinancialRecord(id: number, recordData: Partial<FinancialRecord>): Promise<FinancialRecord | undefined> {
    const record = this.financialRecords.get(id);
    if (!record) return undefined;
    
    const updatedRecord = { ...record, ...recordData };
    this.financialRecords.set(id, updatedRecord);
    return updatedRecord;
  }
  
  async deleteFinancialRecord(id: number): Promise<boolean> {
    return this.financialRecords.delete(id);
  }

  // Budget methods
  async getBudgets(userId: number, departmentId?: number, projectId?: number): Promise<Budget[]> {
    return Array.from(this.budgets.values()).filter(
      (budget) => {
        if (departmentId && projectId) {
          return budget.userId === userId && budget.departmentId === departmentId && budget.projectId === projectId;
        } else if (departmentId) {
          return budget.userId === userId && budget.departmentId === departmentId;
        } else if (projectId) {
          return budget.userId === userId && budget.projectId === projectId;
        }
        return budget.userId === userId;
      }
    );
  }
  
  async getBudget(id: number): Promise<Budget | undefined> {
    return this.budgets.get(id);
  }
  
  async createBudget(budgetData: InsertBudget): Promise<Budget> {
    const id = this.budgetIdCounter++;
    const createdAt = new Date();
    
    const budget: Budget = { 
      id, 
      userId: budgetData.userId,
      name: budgetData.name,
      amount: budgetData.amount,
      period: budgetData.period,
      createdAt,
      departmentId: budgetData.departmentId || null,
      projectId: budgetData.projectId || null,
      description: budgetData.description || null,
      category: budgetData.category || null,
      startDate: budgetData.startDate || null,
      endDate: budgetData.endDate || null,
      actualSpent: budgetData.actualSpent || null,
      status: budgetData.status || null
    };
    this.budgets.set(id, budget);
    return budget;
  }
  
  async updateBudget(id: number, budgetData: Partial<Budget>): Promise<Budget | undefined> {
    const budget = this.budgets.get(id);
    if (!budget) return undefined;
    
    const updatedBudget = { ...budget, ...budgetData };
    this.budgets.set(id, updatedBudget);
    return updatedBudget;
  }
  
  async deleteBudget(id: number): Promise<boolean> {
    return this.budgets.delete(id);
  }

  // Project methods
  async getProjects(userId: number, teamId?: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => {
        if (teamId) {
          return project.userId === userId && project.teamId === teamId;
        }
        return project.userId === userId;
      }
    );
  }
  
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }
  
  async createProject(projectData: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const createdAt = new Date();
    
    const project: Project = { 
      id, 
      userId: projectData.userId,
      name: projectData.name,
      description: projectData.description || null,
      teamId: projectData.teamId || null,
      status: projectData.status || null,
      startDate: projectData.startDate || null,
      endDate: projectData.endDate || null,
      budget: projectData.budget || null,
      progress: projectData.progress || null,
      priority: projectData.priority || null,
      completedAt: projectData.completedAt || null,
      createdAt
    };
    this.projects.set(id, project);
    return project;
  }
  
  async updateProject(id: number, projectData: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...projectData };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }
  
  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Meeting methods
  async getMeetings(userId: number, teamId?: number, projectId?: number): Promise<Meeting[]> {
    return Array.from(this.meetings.values()).filter(
      (meeting) => {
        if (teamId && projectId) {
          return meeting.userId === userId && meeting.teamId === teamId && meeting.projectId === projectId;
        } else if (teamId) {
          return meeting.userId === userId && meeting.teamId === teamId;
        } else if (projectId) {
          return meeting.userId === userId && meeting.projectId === projectId;
        }
        return meeting.userId === userId;
      }
    );
  }
  
  async getMeeting(id: number): Promise<Meeting | undefined> {
    return this.meetings.get(id);
  }
  
  async createMeeting(meetingData: InsertMeeting): Promise<Meeting> {
    const id = this.meetingIdCounter++;
    const createdAt = new Date();
    
    const meeting: Meeting = { 
      id, 
      userId: meetingData.userId,
      title: meetingData.title,
      description: meetingData.description || null,
      startTime: meetingData.startTime,
      endTime: meetingData.endTime,
      location: meetingData.location || null,
      teamId: meetingData.teamId || null,
      projectId: meetingData.projectId || null,
      status: meetingData.status || null,
      agenda: meetingData.agenda || null,
      notes: meetingData.notes || null,
      attendees: meetingData.attendees || null,
      createdAt
    };
    this.meetings.set(id, meeting);
    return meeting;
  }
  
  async updateMeeting(id: number, meetingData: Partial<Meeting>): Promise<Meeting | undefined> {
    const meeting = this.meetings.get(id);
    if (!meeting) return undefined;
    
    const updatedMeeting = { ...meeting, ...meetingData };
    this.meetings.set(id, updatedMeeting);
    return updatedMeeting;
  }
  
  async deleteMeeting(id: number): Promise<boolean> {
    return this.meetings.delete(id);
  }

  // Helper method to implement the top performing employee methods
  async getTopPerformingEmployees(userId: number, limit: number = 5): Promise<Employee[]> {
    const employees = Array.from(this.employees.values())
      .filter(employee => employee.userId === userId)
      .filter(employee => employee.performance !== null);
    
    // Sort by performance metric (higher is better)
    employees.sort((a, b) => {
      const perfA = a.performance || 0;
      const perfB = b.performance || 0;
      return perfB - perfA;
    });
    
    return employees.slice(0, limit);
  }

  // Helper method to implement the top products method
  async getTopProducts(userId: number, limit: number = 5): Promise<Product[]> {
    const products = Array.from(this.products.values())
      .filter(product => product.userId === userId)
      .filter(product => product.sales !== null);
    
    // Sort by sales metric (higher is better)
    products.sort((a, b) => {
      const salesA = Number(a.sales) || 0;
      const salesB = Number(b.sales) || 0;
      return salesB - salesA;
    });
    
    return products.slice(0, limit);
  }

  // Helper method to generate a web link based on company name
  private generateWebLink(companyName: string): string {
    if (!companyName) return '';
    return `bizmanager.com/${companyName.toLowerCase().replace(/\s+/g, '-')}`;
  }
}

export const storage = new MemStorage();
