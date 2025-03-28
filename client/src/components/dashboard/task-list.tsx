import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Task } from "@shared/schema";

interface TaskBadgeProps {
  label: string;
  type: 'urgent' | 'important' | 'marketing' | 'admin' | 'customer';
}

function TaskBadge({ label, type }: TaskBadgeProps) {
  const colors = {
    urgent: "bg-red-50 text-red-600",
    important: "bg-yellow-50 text-yellow-600",
    marketing: "bg-green-50 text-green-600",
    admin: "bg-blue-50 text-primary",
    customer: "bg-purple-50 text-purple-600"
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${colors[type]}`}>
      {label}
    </span>
  );
}

interface TaskItemProps {
  task: Task;
  onTaskComplete: (id: number, completed: boolean) => void;
}

function TaskItem({ task, onTaskComplete }: TaskItemProps) {
  const completed = task.status === 'completed';
  const getBadgeType = (): TaskBadgeProps['type'] => {
    switch (task.priority) {
      case 'high': return 'urgent';
      case 'medium': return 'important';
      default: return task.category as TaskBadgeProps['type'] || 'admin';
    }
  };

  const getBadgeLabel = (): string => {
    if (task.priority === 'high') return 'Urgent';
    if (task.priority === 'medium') return 'Important';
    return task.category || 'Admin';
  };

  return (
    <div className="flex items-center">
      <Checkbox 
        id={`task-${task.id}`} 
        checked={completed}
        onCheckedChange={(checked) => onTaskComplete(task.id, !!checked)}
      />
      <div className="ml-3 flex-1">
        <label 
          htmlFor={`task-${task.id}`} 
          className="text-sm font-medium text-neutral-800"
        >
          {task.title}
        </label>
        {task.dueDate && (
          <p className="text-xs text-neutral-400 mt-1">
            Due {new Date(task.dueDate).toLocaleString()}
          </p>
        )}
      </div>
      <div className="flex items-center">
        <TaskBadge type={getBadgeType()} label={getBadgeLabel()} />
      </div>
    </div>
  );
}

interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
}

export function TaskList({ tasks, isLoading = false }: TaskListProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<Task> }) => {
      const res = await apiRequest("PUT", `/api/tasks/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({
        title: "Task updated",
        description: "Task status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update task",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleTaskComplete = (id: number, completed: boolean) => {
    updateTaskMutation.mutate({
      id,
      data: { status: completed ? 'completed' : 'pending' }
    });
  };

  return (
    <Card>
      <CardHeader className="border-b border-neutral-200 flex flex-row items-center justify-between">
        <CardTitle>Today's Tasks</CardTitle>
        <Button size="sm" variant="ghost" className="text-primary flex items-center">
          <PlusIcon className="h-4 w-4 mr-1" />
          New Task
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center animate-pulse">
                <div className="h-4 w-4 bg-neutral-200 rounded mr-3" />
                <div className="flex-1">
                  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-neutral-200 rounded w-1/4" />
                </div>
                <div className="h-6 w-16 bg-neutral-200 rounded-full" />
              </div>
            ))}
          </div>
        ) : tasks.length > 0 ? (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onTaskComplete={handleTaskComplete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-neutral-600">No tasks for today</p>
            <Button size="sm" className="mt-2">Add your first task</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
