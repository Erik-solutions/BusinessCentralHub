import { useState } from "react";
import { Bell, Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

interface TopNavbarProps {
  title: string;
  toggleSidebar: () => void;
}

interface Notification {
  id: string;
  type: 'message' | 'task' | 'payment' | 'alert';
  title: string;
  description: string;
  time: string;
}

export function TopNavbar({ title, toggleSidebar }: TopNavbarProps) {
  const { user, logoutMutation } = useAuth();
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'message',
      title: 'New message from John',
      description: 'Can we schedule a meeting tomorrow?',
      time: '5 minutes ago'
    },
    {
      id: '2',
      type: 'task',
      title: 'Task completed',
      description: 'Website redesign project has been marked as completed.',
      time: '1 hour ago'
    },
    {
      id: '3',
      type: 'alert',
      title: 'Payment reminder',
      description: 'Invoice #3429 is due in 3 days.',
      time: 'Yesterday'
    }
  ]);

  const getNotificationIcon = (type: string) => {
    const bgColors = {
      message: 'bg-blue-100 text-primary',
      task: 'bg-green-100 text-green-600',
      payment: 'bg-purple-100 text-purple-600',
      alert: 'bg-yellow-100 text-yellow-600'
    };

    return bgColors[type as keyof typeof bgColors] || 'bg-neutral-100 text-neutral-600';
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button 
              className="md:hidden p-2 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="ml-2 md:ml-0 text-xl font-semibold font-heading text-neutral-800">
              {title}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="bg-neutral-50">
                  Notifications
                </DropdownMenuLabel>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="p-0">
                      <Link href="#" className="flex w-full px-4 py-3 hover:bg-neutral-50">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <span className={`inline-block h-8 w-8 rounded-full ${getNotificationIcon(notification.type)} flex items-center justify-center`}>
                              <Bell className="h-4 w-4" />
                            </span>
                          </div>
                          <div className="ml-3 w-0 flex-1">
                            <p className="text-sm font-medium text-neutral-800">{notification.title}</p>
                            <p className="text-xs text-neutral-600 mt-1">{notification.description}</p>
                            <p className="text-xs text-neutral-400 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="#" className="w-full">
                    <div className="text-sm font-medium text-primary">View all notifications</div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                    {user?.companyName?.charAt(0) || 'B'}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-neutral-800">
                    {user?.companyName || 'Business'}
                  </span>
                  <ChevronDown className="h-5 w-5 text-neutral-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings">Profile Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
