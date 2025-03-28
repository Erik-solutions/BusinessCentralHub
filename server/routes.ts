import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertCustomerSchema, insertEmployeeSchema, insertProductSchema, insertTaskSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Customer routes
  app.get("/api/customers", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const customers = await storage.getCustomers(req.user!.id);
      res.json(customers);
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/customers/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const customer = await storage.getCustomer(parseInt(req.params.id));
      if (!customer || customer.userId !== req.user!.id) {
        return res.sendStatus(404);
      }
      res.json(customer);
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/customers", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const customerData = insertCustomerSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      const customer = await storage.createCustomer(customerData);
      res.status(201).json(customer);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json(err.errors);
      }
      next(err);
    }
  });

  app.put("/api/customers/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const customer = await storage.getCustomer(parseInt(req.params.id));
      if (!customer || customer.userId !== req.user!.id) {
        return res.sendStatus(404);
      }
      
      const updatedCustomer = await storage.updateCustomer(
        parseInt(req.params.id),
        req.body
      );
      res.json(updatedCustomer);
    } catch (err) {
      next(err);
    }
  });

  app.delete("/api/customers/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const customer = await storage.getCustomer(parseInt(req.params.id));
      if (!customer || customer.userId !== req.user!.id) {
        return res.sendStatus(404);
      }
      
      await storage.deleteCustomer(parseInt(req.params.id));
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });

  // Employee routes
  app.get("/api/employees", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const employees = await storage.getEmployees(req.user!.id);
      res.json(employees);
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/employees/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const employee = await storage.getEmployee(parseInt(req.params.id));
      if (!employee || employee.userId !== req.user!.id) {
        return res.sendStatus(404);
      }
      res.json(employee);
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/employees", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const employeeData = insertEmployeeSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      const employee = await storage.createEmployee(employeeData);
      res.status(201).json(employee);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json(err.errors);
      }
      next(err);
    }
  });

  app.put("/api/employees/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const employee = await storage.getEmployee(parseInt(req.params.id));
      if (!employee || employee.userId !== req.user!.id) {
        return res.sendStatus(404);
      }
      
      const updatedEmployee = await storage.updateEmployee(
        parseInt(req.params.id),
        req.body
      );
      res.json(updatedEmployee);
    } catch (err) {
      next(err);
    }
  });

  app.delete("/api/employees/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const employee = await storage.getEmployee(parseInt(req.params.id));
      if (!employee || employee.userId !== req.user!.id) {
        return res.sendStatus(404);
      }
      
      await storage.deleteEmployee(parseInt(req.params.id));
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });

  // Product routes
  app.get("/api/products", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const products = await storage.getProducts(req.user!.id);
      res.json(products);
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/products/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const product = await storage.getProduct(parseInt(req.params.id));
      if (!product || product.userId !== req.user!.id) {
        return res.sendStatus(404);
      }
      res.json(product);
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/products", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const productData = insertProductSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json(err.errors);
      }
      next(err);
    }
  });

  app.put("/api/products/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const product = await storage.getProduct(parseInt(req.params.id));
      if (!product || product.userId !== req.user!.id) {
        return res.sendStatus(404);
      }
      
      const updatedProduct = await storage.updateProduct(
        parseInt(req.params.id),
        req.body
      );
      res.json(updatedProduct);
    } catch (err) {
      next(err);
    }
  });

  app.delete("/api/products/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const product = await storage.getProduct(parseInt(req.params.id));
      if (!product || product.userId !== req.user!.id) {
        return res.sendStatus(404);
      }
      
      await storage.deleteProduct(parseInt(req.params.id));
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });

  // Task routes
  app.get("/api/tasks", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const tasks = await storage.getTasks(req.user!.id);
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/tasks/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const task = await storage.getTask(parseInt(req.params.id));
      if (!task || task.userId !== req.user!.id) {
        return res.sendStatus(404);
      }
      res.json(task);
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/tasks", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const taskData = insertTaskSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json(err.errors);
      }
      next(err);
    }
  });

  app.put("/api/tasks/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const task = await storage.getTask(parseInt(req.params.id));
      if (!task || task.userId !== req.user!.id) {
        return res.sendStatus(404);
      }
      
      const updatedTask = await storage.updateTask(
        parseInt(req.params.id),
        req.body
      );
      res.json(updatedTask);
    } catch (err) {
      next(err);
    }
  });

  app.delete("/api/tasks/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const task = await storage.getTask(parseInt(req.params.id));
      if (!task || task.userId !== req.user!.id) {
        return res.sendStatus(404);
      }
      
      await storage.deleteTask(parseInt(req.params.id));
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });

  // User profile route
  app.put("/api/profile", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const updatedProfile = await storage.updateUser(req.user!.id, req.body);
      if (!updatedProfile) {
        return res.status(404).send("User not found");
      }
      
      const safeProfile = { ...updatedProfile };
      delete (safeProfile as any).password;
      res.json(safeProfile);
    } catch (err) {
      next(err);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
