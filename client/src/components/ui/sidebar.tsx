import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import {
  Home,
  Users,
  User,
  DollarSign,
  FileText,
  ShoppingBag,
  Settings,
  LogOut,
  Copy,
} from "lucide-react";
import { Button } from "./button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const webLink = user?.webLink || `bizmanager.com/${user?.companyName?.toLowerCase().replace(/\s+/g, '-')}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(webLink);
    toast({
      title: "Copied!",
      description: "Web link copied to clipboard",
    });
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navItems = [
    { href: "/", label: "Dashboard", icon: <Home className="h-5 w-5 mr-3" /> },
    { href: "/crm", label: "CRM", icon: <Users className="h-5 w-5 mr-3" /> },
    { href: "/hr", label: "HR", icon: <User className="h-5 w-5 mr-3" /> },
    { href: "/accounting", label: "Accounting", icon: <DollarSign className="h-5 w-5 mr-3" /> },
    { href: "/operations", label: "Operations", icon: <FileText className="h-5 w-5 mr-3" /> },
    { href: "/marketplace", label: "Marketplace", icon: <ShoppingBag className="h-5 w-5 mr-3" /> },
    { href: "/settings", label: "Settings", icon: <Settings className="h-5 w-5 mr-3" /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 transform transition duration-300 ease-in-out z-30 w-64 bg-white shadow-lg md:static md:h-auto md:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center">
              <span className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-white" />
              </span>
              <span className="ml-2 text-lg font-bold text-neutral-800 font-heading">BizManager</span>
            </Link>
            <button 
              className="md:hidden text-neutral-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-8">
            <div className="px-4 py-3 bg-neutral-100 rounded-lg mb-6">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                  {user?.companyName?.charAt(0) || 'B'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-neutral-800">{user?.companyName || 'Business'}</p>
                  <p className="text-xs text-neutral-600">Admin</p>
                </div>
              </div>
            </div>
            
            <nav>
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <a 
                        className={cn(
                          "flex items-center px-4 py-3 text-sm font-medium rounded-lg",
                          location === item.href 
                            ? "text-primary bg-blue-50" 
                            : "text-neutral-600 hover:bg-neutral-100"
                        )}
                      >
                        {item.icon}
                        {item.label}
                      </a>
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
          </div>
          
          <div className="mt-auto p-4 bg-blue-50 rounded-lg">
            <div className="text-xs font-medium text-neutral-600 mb-2">Your customer web link:</div>
            <div className="flex">
              <input 
                type="text"
                value={webLink}
                className="flex-grow text-xs text-neutral-600 p-2 bg-white border border-neutral-200 rounded-l-md"
                readOnly
              />
              <button 
                className="px-2 bg-primary text-white rounded-r-md" 
                title="Copy to clipboard"
                onClick={handleCopyLink}
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export { Sidebar };
