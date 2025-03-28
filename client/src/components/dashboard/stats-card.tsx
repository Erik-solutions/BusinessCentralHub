import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor: string;
  iconColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  icon, 
  iconBgColor, 
  iconColor,
  trend, 
  className 
}: StatsCardProps) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-center">
        <div className={cn("inline-flex items-center justify-center h-12 w-12 rounded-full", iconBgColor)}>
          <div className={cn("h-6 w-6", iconColor)}>
            {icon}
          </div>
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-neutral-600">{title}</h3>
          <p className="text-2xl font-semibold text-neutral-800">{value}</p>
          {trend && (
            <p className={cn(
              "text-xs flex items-center mt-1",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-3 w-3 mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={trend.isPositive 
                    ? "M5 10l7-7m0 0l7 7m-7-7v18" 
                    : "M19 14l-7 7m0 0l-7-7m7 7V3"} 
                />
              </svg>
              {trend.value}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
