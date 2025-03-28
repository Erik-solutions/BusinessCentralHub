import { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { TopNavbar } from "@/components/ui/top-navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Loader2, DollarSign, ArrowDownIcon, ArrowUpIcon, PlusIcon, Ban, CreditCard, Receipt } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Schemas for invoice and expense forms
const invoiceFormSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  amount: z.string().min(1, "Amount is required"),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.enum(["draft", "sent", "paid", "overdue"]),
  description: z.string().optional(),
});

const expenseFormSchema = z.object({
  vendor: z.string().min(1, "Vendor name is required"),
  amount: z.string().min(1, "Amount is required"),
  date: z.string().min(1, "Date is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;
type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

// Sample data
const invoices = [
  { id: 1, customer: "Acme Corp", amount: "$2,500", dueDate: "2023-08-15", status: "paid" },
  { id: 2, customer: "Globex Inc", amount: "$1,800", dueDate: "2023-08-30", status: "sent" },
  { id: 3, customer: "Stark Industries", amount: "$3,200", dueDate: "2023-09-10", status: "draft" },
  { id: 4, customer: "Wayne Enterprises", amount: "$4,500", dueDate: "2023-08-05", status: "overdue" },
];

const expenses = [
  { id: 1, vendor: "Office Supplies Inc", amount: "$240", date: "2023-08-02", category: "Office Supplies" },
  { id: 2, vendor: "Cloud Services Co", amount: "$320", date: "2023-08-05", category: "Software" },
  { id: 3, vendor: "Marketing Agency", amount: "$1,200", date: "2023-08-10", category: "Marketing" },
  { id: 4, vendor: "City Utilities", amount: "$180", date: "2023-08-15", category: "Utilities" },
];

export default function AccountingPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const { toast } = useToast();

  // Invoice form setup
  const invoiceForm = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      customerName: "",
      amount: "",
      dueDate: "",
      status: "draft",
      description: "",
    },
  });

  // Expense form setup
  const expenseForm = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      vendor: "",
      amount: "",
      date: "",
      category: "",
      description: "",
    },
  });

  const onInvoiceSubmit = (data: InvoiceFormValues) => {
    console.log(data);
    toast({
      title: "Invoice created",
      description: "New invoice has been created successfully.",
    });
    setIsInvoiceDialogOpen(false);
    invoiceForm.reset();
  };

  const onExpenseSubmit = (data: ExpenseFormValues) => {
    console.log(data);
    toast({
      title: "Expense recorded",
      description: "New expense has been recorded successfully.",
    });
    setIsExpenseDialogOpen(false);
    expenseForm.reset();
  };

  // Helper function for status badge
  const getInvoiceStatusBadge = (status: string) => {
    const styles = {
      draft: "bg-neutral-100 text-neutral-800",
      sent: "bg-blue-100 text-blue-800",
      paid: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-800",
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>{status}</span>;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-neutral-100">
      <Sidebar className={isSidebarOpen ? "translate-x-0" : ""} />
      
      <div className="flex-1">
        <TopNavbar 
          title="Accounting" 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="rounded-full bg-green-100 p-3 mr-4">
                      <ArrowUpIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Total Income</p>
                      <h3 className="text-2xl font-semibold text-neutral-800">$12,580</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="rounded-full bg-red-100 p-3 mr-4">
                      <ArrowDownIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Total Expenses</p>
                      <h3 className="text-2xl font-semibold text-neutral-800">$6,240</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="rounded-full bg-blue-100 p-3 mr-4">
                      <Receipt className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Pending Invoices</p>
                      <h3 className="text-2xl font-semibold text-neutral-800">$4,320</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="rounded-full bg-purple-100 p-3 mr-4">
                      <DollarSign className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Net Profit</p>
                      <h3 className="text-2xl font-semibold text-neutral-800">$6,340</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Invoices and Expenses Tabs */}
            <Tabs defaultValue="invoices" className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="invoices">Invoices</TabsTrigger>
                  <TabsTrigger value="expenses">Expenses</TabsTrigger>
                </TabsList>
                
                <div className="space-x-2">
                  <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="hidden md:inline-flex">
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Create Invoice
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Invoice</DialogTitle>
                        <DialogDescription>
                          Enter the invoice details below to create a new invoice.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...invoiceForm}>
                        <form onSubmit={invoiceForm.handleSubmit(onInvoiceSubmit)} className="space-y-4">
                          <FormField
                            control={invoiceForm.control}
                            name="customerName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Customer Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Customer or company name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={invoiceForm.control}
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Amount *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Amount (e.g. 1000.00)" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={invoiceForm.control}
                            name="dueDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Due Date *</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={invoiceForm.control}
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
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="sent">Sent</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="overdue">Overdue</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={invoiceForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="Additional details about this invoice" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <DialogFooter>
                            <Button type="submit">Create Invoice</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="hidden md:inline-flex">
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Record Expense
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Record New Expense</DialogTitle>
                        <DialogDescription>
                          Enter the expense details below to record a new expense.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...expenseForm}>
                        <form onSubmit={expenseForm.handleSubmit(onExpenseSubmit)} className="space-y-4">
                          <FormField
                            control={expenseForm.control}
                            name="vendor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Vendor/Payee *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Vendor or payee name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={expenseForm.control}
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Amount *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Amount (e.g. 1000.00)" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={expenseForm.control}
                            name="date"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date *</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={expenseForm.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Expense category" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={expenseForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="Additional details about this expense" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <DialogFooter>
                            <Button type="submit">Record Expense</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              {/* Invoices Tab Content */}
              <TabsContent value="invoices">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Invoices</CardTitle>
                      <CardDescription>Manage and track your customer invoices</CardDescription>
                    </div>
                    <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="md:hidden">
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Create Invoice
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice #</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoices.map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell className="font-medium">INV-{invoice.id.toString().padStart(4, '0')}</TableCell>
                            <TableCell>{invoice.customer}</TableCell>
                            <TableCell>{invoice.amount}</TableCell>
                            <TableCell>{invoice.dueDate}</TableCell>
                            <TableCell>{getInvoiceStatusBadge(invoice.status)}</TableCell>
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
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Expenses Tab Content */}
              <TabsContent value="expenses">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Expenses</CardTitle>
                      <CardDescription>Track and manage your business expenses</CardDescription>
                    </div>
                    <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="md:hidden">
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Record Expense
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Expense #</TableHead>
                          <TableHead>Vendor</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {expenses.map((expense) => (
                          <TableRow key={expense.id}>
                            <TableCell className="font-medium">EXP-{expense.id.toString().padStart(4, '0')}</TableCell>
                            <TableCell>{expense.vendor}</TableCell>
                            <TableCell>{expense.amount}</TableCell>
                            <TableCell>{expense.date}</TableCell>
                            <TableCell>{expense.category}</TableCell>
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
