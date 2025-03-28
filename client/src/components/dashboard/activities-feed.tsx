import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ShoppingBag, 
  CheckSquare, 
  DollarSign, 
  Bell, 
  User 
} from "lucide-react";

interface ActivityItem {
  id: string;
  icon: 'order' | 'task' | 'payment' | 'alert' | 'customer';
  title: string;
  description: string;
  timeAgo: string;
}

interface ActivitiesFeedProps {
  activities: ActivityItem[];
}

const iconMap = {
  'order': <ShoppingBag className="h-4 w-4" />,
  'task': <CheckSquare className="h-4 w-4" />,
  'payment': <DollarSign className="h-4 w-4" />,
  'alert': <Bell className="h-4 w-4" />,
  'customer': <User className="h-4 w-4" />
};

const bgColorMap = {
  'order': 'bg-blue-100',
  'task': 'bg-green-100',
  'payment': 'bg-purple-100',
  'alert': 'bg-yellow-100',
  'customer': 'bg-blue-100'
};

const textColorMap = {
  'order': 'text-primary',
  'task': 'text-green-600',
  'payment': 'text-purple-600',
  'alert': 'text-yellow-600',
  'customer': 'text-primary'
};

export function ActivitiesFeed({ activities }: ActivitiesFeedProps) {
  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4 px-1">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start">
            <div className="flex-shrink-0">
              <span className={`inline-block h-8 w-8 rounded-full ${bgColorMap[activity.icon]} ${textColorMap[activity.icon]} flex items-center justify-center`}>
                {iconMap[activity.icon]}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-neutral-800 whitespace-normal break-words">
                <span dangerouslySetInnerHTML={{ __html: activity.title }} />
              </p>
              <p className="text-xs text-neutral-400 mt-1">{activity.timeAgo}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
