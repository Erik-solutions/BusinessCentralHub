import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CustomerEngagement {
  id: string;
  name: string;
  timeAgo: string;
  message: string;
  image?: string;
}

interface CustomerEngagementProps {
  engagements: CustomerEngagement[];
}

export function CustomerEngagementList({ engagements }: CustomerEngagementProps) {
  return (
    <Card>
      <CardHeader className="border-b border-neutral-200">
        <CardTitle>Recent Customer Engagement</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-neutral-200">
          {engagements.map((engagement) => (
            <div key={engagement.id} className="p-6">
              <div className="flex">
                <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden">
                  {engagement.image ? (
                    <img 
                      src={engagement.image} 
                      alt={engagement.name} 
                      className="h-10 w-10 rounded-full object-cover" 
                    />
                  ) : (
                    <div className="h-10 w-10 flex items-center justify-center bg-primary text-white font-medium rounded-full">
                      {engagement.name.substring(0, 1)}
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-neutral-800">{engagement.name}</h3>
                    <span className="text-xs text-neutral-400">{engagement.timeAgo}</span>
                  </div>
                  <p className="text-sm text-neutral-600 mt-1">{engagement.message}</p>
                  <div className="mt-3 flex space-x-2">
                    <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary">Reply</Button>
                    <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary">View Profile</Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
