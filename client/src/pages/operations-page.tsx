import { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { TopNavbar } from "@/components/ui/top-navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Task } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTaskSchema } from "@shared/schema";
import { z } from "zod";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  PlusIcon,
  Calendar,
  CalendarCheck,
  CalendarClock,
  ClipboardCheck,
  Filter
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Create a form schema based on the task schema
const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().or(z.literal("")),
  dueDate: z.string().optional().or(z.literal("")),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]),
  priority: z.enum(["low", "medium", "high"]),
  category: z.string().optional().or(z.literal("")),
  assignedTo: z.string().optional().or(z.literal("")),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

export default function OperationsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tasks data
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
  });

  // Form setup
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      status: "pending",
      priority: "medium",
      category: "",
      assignedTo: "",
    },
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (data: TaskFormValues) => {
      // Convert assignedTo to number if provided
      const payload = {
        ...data,
        assignedTo: data.assignedTo ? parseInt(data.assignedTo) : undefined,
      };
      
      const res = await apiRequest("POST", "/api/tasks", payload);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({
        title: "Task created",
        description: "New task has been created successfully.",
      });
      setIsAddTaskDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to create task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TaskFormValues) => {
    createTaskMutation.mutate(data);
  };

  // Filter and group tasks by status
  const pendingTasks = tasks?.filter(task => task.status === "pending") || [];
  const inProgressTasks = tasks?.filter(task => task.status === "in_progress") || [];
  const completedTasks = tasks?.filter(task => task.status === "completed") || [];

  // Helper functions for task display
  const getPriorityBadge = (priority: string) => {
    const styles = {
      low: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      high: "bg-red-100 text-red-800 hover:bg-red-100",
    };
    return (
      <Badge className={styles[priority as keyof typeof styles]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "in_progress":
        return <CalendarClock className="h-5 w-5 text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-neutral-400" />;
    }
  };

  // Task card component
  const TaskCard = ({ task }: { task: Task }) => {
    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
    const isOverdue = dueDate && dueDate < new Date() && task.status !== "completed";
    
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              {getStatusIcon(task.status || "pending")}
              <div>
                <h3 className="font-medium">{task.title}</h3>
                {task.description && (
                  <p className="text-sm text-neutral-600 mt-1">{task.description}</p>
                )}
              </div>
            </div>
            {getPriorityBadge(task.priority || "medium")}
          </div>
          
          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {task.dueDate && (
                <div className="flex items-center text-xs text-neutral-600">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span className={isOverdue ? "text-red-600 font-medium" : ""}>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              {task.category && (
                <Badge variant="outline" className="text-xs">
                  {task.category}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm">View</Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-neutral-100">
      <Sidebar className={isSidebarOpen ? "translate-x-0" : ""} />
      
      <div className="flex-1">
        <TopNavbar 
          title="Operations" 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-neutral-800">Task Management</h1>
                <p className="text-neutral-600">Track and manage your team's tasks and projects</p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add New Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Task</DialogTitle>
                      <DialogDescription>
                        Fill in the task details to create a new task.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title *</FormLabel>
                              <FormControl>
                                <Input placeholder="Task title" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Task description" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="dueDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Due Date</FormLabel>
                                <FormControl>
                                  <Input type="datetime-local" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="priority"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Priority</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. Marketing, Development" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <DialogFooter>
                          <Button 
                            type="submit" 
                            disabled={createTaskMutation.isPending}
                          >
                            {createTaskMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                              </>
                            ) : "Create Task"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            {/* Task Board */}
            <Tabs defaultValue="kanban" className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
                  <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>
                
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              
              {/* Kanban Board View */}
              <TabsContent value="kanban" className="space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Pending Column */}
                    <div>
                      <div className="bg-neutral-100 p-3 rounded-t-lg border border-neutral-200 flex items-center">
                        <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                        <h2 className="font-medium">To Do ({pendingTasks.length})</h2>
                      </div>
                      <div className="bg-neutral-50 p-3 rounded-b-lg border-b border-l border-r border-neutral-200 min-h-[200px]">
                        {pendingTasks.length > 0 ? (
                          pendingTasks.map(task => (
                            <TaskCard key={task.id} task={task} />
                          ))
                        ) : (
                          <div className="text-center py-8 text-neutral-400 text-sm">
                            No pending tasks
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* In Progress Column */}
                    <div>
                      <div className="bg-neutral-100 p-3 rounded-t-lg border border-neutral-200 flex items-center">
                        <CalendarClock className="h-5 w-5 text-blue-500 mr-2" />
                        <h2 className="font-medium">In Progress ({inProgressTasks.length})</h2>
                      </div>
                      <div className="bg-neutral-50 p-3 rounded-b-lg border-b border-l border-r border-neutral-200 min-h-[200px]">
                        {inProgressTasks.length > 0 ? (
                          inProgressTasks.map(task => (
                            <TaskCard key={task.id} task={task} />
                          ))
                        ) : (
                          <div className="text-center py-8 text-neutral-400 text-sm">
                            No tasks in progress
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Completed Column */}
                    <div>
                      <div className="bg-neutral-100 p-3 rounded-t-lg border border-neutral-200 flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <h2 className="font-medium">Completed ({completedTasks.length})</h2>
                      </div>
                      <div className="bg-neutral-50 p-3 rounded-b-lg border-b border-l border-r border-neutral-200 min-h-[200px]">
                        {completedTasks.length > 0 ? (
                          completedTasks.map(task => (
                            <TaskCard key={task.id} task={task} />
                          ))
                        ) : (
                          <div className="text-center py-8 text-neutral-400 text-sm">
                            No completed tasks
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              {/* List View */}
              <TabsContent value="list">
                <Card>
                  <CardHeader>
                    <CardTitle>All Tasks</CardTitle>
                    <CardDescription>View all your tasks in a list format</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : tasks && tasks.length > 0 ? (
                      <div className="space-y-4">
                        {tasks.map(task => (
                          <div key={task.id} className="flex items-center justify-between border-b border-neutral-100 pb-3">
                            <div className="flex items-start space-x-3">
                              {getStatusIcon(task.status || "pending")}
                              <div>
                                <h3 className="font-medium text-neutral-800">{task.title}</h3>
                                {task.description && (
                                  <p className="text-sm text-neutral-600 mt-1">{task.description}</p>
                                )}
                                <div className="flex items-center mt-2 space-x-2">
                                  {task.dueDate && (
                                    <span className="text-xs flex items-center text-neutral-500">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      {new Date(task.dueDate).toLocaleDateString()}
                                    </span>
                                  )}
                                  {task.category && (
                                    <Badge variant="outline" className="text-xs">
                                      {task.category}
                                    </Badge>
                                  )}
                                  {getPriorityBadge(task.priority || "medium")}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">Edit</Button>
                              <Button variant="ghost" size="sm">View</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64">
                        <ClipboardCheck className="h-12 w-12 text-neutral-300 mb-4" />
                        <h3 className="text-lg font-medium text-neutral-800">No tasks found</h3>
                        <p className="text-neutral-600 mb-4">Start by creating your first task</p>
                        <Button onClick={() => setIsAddTaskDialogOpen(true)}>Add Your First Task</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
