import { Clock, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Task } from "@shared/schema";

interface TaskItemProps {
  task: Task;
  onComplete: (taskId: string) => void;
  isCompleting: boolean;
}

export default function TaskItem({ task, onComplete, isCompleting }: TaskItemProps) {
  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "high":
        return "bg-red-100 text-red-700";
      case "critical":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityLabel = (priority: string | null) => {
    switch (priority) {
      case "low":
        return "Low Priority";
      case "medium":
        return "Medium Priority";
      case "high":
        return "High Priority";
      case "critical":
        return "Critical Priority";
      default:
        return "Medium Priority";
    }
  };

  const formatDueTime = (dueDate: string | null) => {
    if (!dueDate) return "No due date";
    const date = new Date(dueDate);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div 
      className="border border-forest-200 rounded-lg p-4 hover:shadow-md transition-shadow"
      data-testid={`task-item-${task.id}`}
    >
      <div className="flex items-start space-x-3">
        <Button
          variant="ghost"
          size="sm"
          className="mt-1 w-5 h-5 p-0 border-2 border-forest-500 rounded hover:bg-forest-50 transition-colors flex-shrink-0"
          onClick={() => onComplete(task.id)}
          disabled={isCompleting}
          data-testid={`button-complete-${task.id}`}
        >
          {isCompleting && <i className="fas fa-spinner fa-spin text-forest-500 text-xs"></i>}
        </Button>
        
        <div className="flex-1">
          <h4 className="font-medium text-forest-800" data-testid={`text-task-title-${task.id}`}>
            {task.title}
          </h4>
          
          {task.description && (
            <p className="text-sm text-forest-600 mt-1" data-testid={`text-task-description-${task.id}`}>
              {task.description}
            </p>
          )}
          
          <div className="flex items-center space-x-4 mt-2 text-sm text-forest-600">
            <span className="flex items-center" data-testid={`text-due-time-${task.id}`}>
              <Clock className="w-3 h-3 mr-1" />
              Due: {formatDueTime(task.dueDate)}
            </span>
            
            <span className="flex items-center" data-testid={`text-xp-reward-${task.id}`}>
              <Star className="w-3 h-3 mr-1 text-yellow-500" />
              {task.experienceReward || 25} XP
            </span>
            
            <Badge 
              className={`text-xs ${getPriorityColor(task.priority)}`}
              data-testid={`badge-priority-${task.id}`}
            >
              {getPriorityLabel(task.priority)}
            </Badge>
          </div>
          
          {task.category && (
            <Badge 
              variant="outline" 
              className="mt-2 text-xs border-forest-300 text-forest-600"
              data-testid={`badge-category-${task.id}`}
            >
              {task.category}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}