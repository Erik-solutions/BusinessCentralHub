import { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { TopNavbar } from "@/components/ui/top-navbar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ActivitiesFeed } from "@/components/dashboard/activities-feed";
import { ProductTable } from "@/components/dashboard/product-table";
import { PerformanceCharts } from "@/components/dashboard/performance-charts";
import { CustomerEngagementList } from "@/components/dashboard/customer-engagement";
import { TaskList } from "@/components/dashboard/task-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Users, ShoppingBag, DollarSign, FileText } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Task } from "@shared/schema";

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  // Tasks data
  const { data: tasks, isLoading: isTasksLoading } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
  });

  // Sample data for dashboard stats
  const dashboardStats = [
    {
      title: "Total Customers",
      value: "124",
      icon: <Users className="h-6 w-6" />,
      iconBgColor: "bg-blue-100",
      iconColor: "text-primary",
      trend: { value: "12% increase", isPositive: true }
    },
    {
      title: "Orders (This Month)",
      value: "85",
      icon: <ShoppingBag className="h-6 w-6" />,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
      trend: { value: "8% increase", isPositive: true }
    },
    {
      title: "Revenue (This Month)",
      value: "$8,492",
      icon: <DollarSign className="h-6 w-6" />,
      iconBgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      trend: { value: "15% increase", isPositive: true }
    },
    {
      title: "Pending Tasks",
      value: tasks?.filter(t => t.status === 'pending').length || "0",
      icon: <FileText className="h-6 w-6" />,
      iconBgColor: "bg-red-100",
      iconColor: "text-red-600",
      trend: { value: "3 overdue", isPositive: false }
    }
  ];

  const activities = [
    {
      id: "1",
      icon: "order",
      title: "<span class='font-medium'>Emily Roberts</span> placed a new order for <span class='font-medium'>Chocolate Cake (x2)</span>",
      description: "",
      timeAgo: "15 minutes ago"
    },
    {
      id: "2",
      icon: "task",
      title: "<span class='font-medium'>You</span> completed task <span class='font-medium'>Update product descriptions</span>",
      description: "",
      timeAgo: "1 hour ago"
    },
    {
      id: "3",
      icon: "payment",
      title: "<span class='font-medium'>Payment received</span> from <span class='font-medium'>Michael Thompson</span> for order #3845",
      description: "",
      timeAgo: "2 hours ago"
    },
    {
      id: "4",
      icon: "alert",
      title: "<span class='font-medium'>Reminder:</span> Inventory for <span class='font-medium'>Vanilla Extract</span> is running low",
      description: "",
      timeAgo: "5 hours ago"
    },
    {
      id: "5",
      icon: "customer",
      title: "<span class='font-medium'>New customer</span> registration: <span class='font-medium'>David Wilson</span>",
      description: "",
      timeAgo: "Yesterday"
    }
  ];

  const topProducts = [
    {
      id: "1",
      name: "Chocolate Cake",
      category: "Desserts",
      sales: 128,
      revenue: "$2,560",
      conversion: 85
    },
    {
      id: "2",
      name: "Vanilla Cupcakes",
      category: "Desserts",
      sales: 96,
      revenue: "$1,440",
      conversion: 72
    },
    {
      id: "3",
      name: "Sourdough Bread",
      category: "Bread",
      sales: 84,
      revenue: "$924",
      conversion: 68
    },
    {
      id: "4",
      name: "Butter Croissants",
      category: "Pastries",
      sales: 72,
      revenue: "$720",
      conversion: 59
    },
    {
      id: "5",
      name: "Custom Birthday Cake",
      category: "Special Orders",
      sales: 42,
      revenue: "$2,100",
      conversion: 54
    }
  ];

  const salesData = [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 4500 },
    { name: "Mar", value: 5000 },
    { name: "Apr", value: 5500 },
    { name: "May", value: 6000 },
    { name: "Jun", value: 6500 },
    { name: "Jul", value: 7500 },
    { name: "Aug", value: 7000 },
    { name: "Sep", value: 8000 },
    { name: "Oct", value: 8500 },
    { name: "Nov", value: 7500 },
    { name: "Dec", value: 6500 }
  ];

  const customerSegments = [
    { name: "New Customers", value: 45, color: "#3B82F6" },
    { name: "Returning", value: 20, color: "#10B981" },
    { name: "Regulars", value: 20, color: "#8B5CF6" },
    { name: "Others", value: 15, color: "#9CA3AF" }
  ];

  const customerEngagements = [
    {
      id: "1",
      name: "Michael Thompson",
      timeAgo: "2 days ago",
      message: "Left a 5-star review: \"The chocolate cake was absolutely delicious! Will definitely order again.\""
    },
    {
      id: "2",
      name: "Emily Roberts",
      timeAgo: "3 days ago",
      message: "Sent an inquiry: \"Do you offer gluten-free options for your birthday cakes?\""
    },
    {
      id: "3",
      name: "David Wilson",
      timeAgo: "5 days ago",
      message: "Placed an order for custom wedding cake consultation."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-neutral-100">
      <Sidebar 
        className={isSidebarOpen ? "translate-x-0" : ""} 
      />
      
      <div className="flex-1">
        <TopNavbar 
          title="Dashboard" 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Business Overview Section */}
            <div className="mb-8">
              <h2 className="text-lg font-medium font-heading text-neutral-800 mb-4">
                Business Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {dashboardStats.map((stat, index) => (
                  <StatsCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    iconBgColor={stat.iconBgColor}
                    iconColor={stat.iconColor}
                    trend={stat.trend}
                  />
                ))}
              </div>
            </div>
            
            {/* Main Content Tabs */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
              <Tabs defaultValue="recent-activities">
                <div className="border-b border-neutral-200">
                  <TabsList className="bg-transparent border-b-0">
                    <TabsTrigger 
                      value="recent-activities" 
                      className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-b-none"
                    >
                      Recent Activities
                    </TabsTrigger>
                    <TabsTrigger 
                      value="top-products"
                      className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-b-none"
                    >
                      Top Products
                    </TabsTrigger>
                    <TabsTrigger 
                      value="performance"
                      className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-b-none"
                    >
                      Performance
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="recent-activities" className="p-6">
                  <ActivitiesFeed activities={activities} />
                </TabsContent>
                
                <TabsContent value="top-products" className="p-6">
                  <ProductTable products={topProducts} />
                </TabsContent>
                
                <TabsContent value="performance" className="p-6">
                  <PerformanceCharts 
                    salesData={salesData}
                    customerSegments={customerSegments}
                  />
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Two Column Section: Customer Engagement & Tasks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <CustomerEngagementList engagements={customerEngagements} />
              </div>
              
              <div>
                <TaskList tasks={tasks || []} isLoading={isTasksLoading} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
