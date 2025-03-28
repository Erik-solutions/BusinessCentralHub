import { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { TopNavbar } from "@/components/ui/top-navbar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Employee } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEmployeeSchema } from "@shared/schema";
import { z } from "zod";
import { PlusIcon, Loader2, UserIcon, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Create a form schema based on the employee schema
const employeeFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  position: z.string().min(1, "Position is required"),
  status: z.enum(["active", "inactive", "on_leave"]),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

export default function HRPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch employees data
  const { data: employees, isLoading } = useQuery<Employee[]>({
    queryKey: ['/api/employees'],
  });

  // Form setup
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      position: "",
      status: "active",
    },
  });

  // Create employee mutation
  const createEmployeeMutation = useMutation({
    mutationFn: async (data: EmployeeFormValues) => {
      const res = await apiRequest("POST", "/api/employees", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/employees'] });
      toast({
        title: "Employee added",
        description: "New employee has been added successfully.",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to add employee",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EmployeeFormValues) => {
    createEmployeeMutation.mutate(data);
  };

  // Filter employees based on search query
  const filteredEmployees = employees?.filter(employee => 
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (employee.email && employee.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (employee.position && employee.position.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inactive</Badge>;
      case 'on_leave':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">On Leave</Badge>;
      default:
        return <Badge className="bg-neutral-100 text-neutral-800 hover:bg-neutral-100">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-neutral-100">
      <Sidebar 
        className={isSidebarOpen ? "translate-x-0" : ""} 
      />
      
      <div className="flex-1">
        <TopNavbar 
          title="Human Resources" 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Employees</CardTitle>
                  <CardDescription>Manage your team members and their information</CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Employee
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Employee</DialogTitle>
                      <DialogDescription>
                        Enter the employee details to add them to your team.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Employee name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="Email address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input placeholder="Phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="position"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Position *</FormLabel>
                              <FormControl>
                                <Input placeholder="Job title/position" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
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
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="inactive">Inactive</SelectItem>
                                  <SelectItem value="on_leave">On Leave</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button 
                            type="submit" 
                            disabled={createEmployeeMutation.isPending}
                          >
                            {createEmployeeMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adding...
                              </>
                            ) : "Add Employee"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input
                      placeholder="Search employees by name, email or position..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredEmployees && filteredEmployees.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmployees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell className="font-medium">{employee.name}</TableCell>
                          <TableCell>{employee.position || "-"}</TableCell>
                          <TableCell>{employee.email || "-"}</TableCell>
                          <TableCell>{employee.phone || "-"}</TableCell>
                          <TableCell>{getStatusBadge(employee.status || "active")}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">View</Button>
                              <Button variant="outline" size="sm">Edit</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <UserIcon className="h-12 w-12 text-neutral-300 mb-4" />
                    <h3 className="text-lg font-medium text-neutral-800 mb-1">No employees found</h3>
                    <p className="text-sm text-neutral-600 mb-4">
                      {searchQuery ? "No results match your search criteria" : "Start adding employees to your team"}
                    </p>
                    {searchQuery ? (
                      <Button variant="outline" onClick={() => setSearchQuery("")}>Clear Search</Button>
                    ) : (
                      <Button onClick={() => setIsDialogOpen(true)}>Add Your First Employee</Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
