import { useUser } from "@/hooks/use-user";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import TaskForm from "@/components/task-form";
import TaskItem from "@/components/task-item";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, Calendar, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Task } from "@shared/schema";

export default function Tasks() {
  const { user, isLoading: userLoading, hasSkipped } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['/api/users', user?.id, 'tasks'],
    enabled: !!user?.id,
  });

  const completeTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const response = await apiRequest('POST', `/api/tasks/${taskId}/complete`, {
        userId: user?.id,
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id, 'tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id] });
      
      toast({
        title: "Quest Completed! 🌱",
        description: `+${data.task.experienceReward} XP earned! Your tree grows stronger.`,
        duration: 3000,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (userLoading || tasksLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-20 bg-white rounded-2xl"></div>
          <div className="h-64 bg-white rounded-2xl"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-white rounded-2xl"></div>
            <div className="h-96 bg-white rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user && !hasSkipped) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-forest-800 mb-4">Create an account to manage tasks</h2>
          <p className="text-forest-600">You need an account to create and track your productivity quests.</p>
        </div>
      </div>
    );
  }

  if (hasSkipped && !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-forest-800 mb-2" data-testid="text-tasks-header">
            Forest Quests (Preview Mode)
          </h2>
          <p className="text-forest-600 text-lg" data-testid="text-tasks-description">
            Create an account to start managing your productivity quests!
          </p>
        </div>

        {/* Preview Content */}
        <Card className="bg-white rounded-2xl shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="text-gray-400">
              <i className="fas fa-lock text-4xl mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Task Management Locked</h3>
              <p className="text-gray-500 mb-6">
                Create an account to unlock task creation, completion tracking, and XP rewards.
              </p>
              <Button 
                className="bg-forest-500 hover:bg-forest-600 text-white"
                data-testid="button-create-account"
              >
                Create Account to Get Started
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const typedTasks = tasks as Task[];
  
  const todayTasks = typedTasks.filter((task: Task) => {
    if (!task.dueDate) return false;
    const today = new Date().toDateString();
    return new Date(task.dueDate).toDateString() === today && task.status === 'pending';
  });

  const upcomingTasks = typedTasks.filter((task: Task) => {
    if (!task.dueDate) return false;
    const today = new Date();
    const taskDate = new Date(task.dueDate);
    return taskDate > today && task.status === 'pending';
  });

  const completedToday = typedTasks.filter((task: Task) => {
    if (!task.completedAt) return false;
    const today = new Date().toDateString();
    return new Date(task.completedAt).toDateString() === today;
  });

  const totalXpToday = completedToday.reduce((sum: number, task: Task) => sum + (task.experienceReward || 0), 0);

  const handleCompleteTask = (taskId: string) => {
    completeTaskMutation.mutate(taskId);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-forest-800 mb-2" data-testid="text-tasks-header">
          Your Forest Quests
        </h2>
        <p className="text-forest-600 text-lg" data-testid="text-tasks-description">
          Complete tasks to help your tree grow and flourish!
        </p>
      </div>

      {/* Add Task Form */}
      <TaskForm userId={user!.id} />

      {/* Task Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        
        {/* Today's Tasks */}
        <Card className="bg-white rounded-2xl shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-forest-800" data-testid="text-today-tasks">
                Today's Quests
              </h3>
              <Badge 
                variant="secondary" 
                className="bg-forest-100 text-forest-700"
                data-testid="badge-today-count"
              >
                {todayTasks.length} active
              </Badge>
            </div>
            
            <div className="space-y-4" data-testid="list-today-tasks">
              {todayTasks.length === 0 ? (
                <div className="text-center py-8 text-forest-600">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No quests for today. Add some tasks to get started!</p>
                </div>
              ) : (
                todayTasks.map((task: Task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onComplete={handleCompleteTask}
                    isCompleting={completeTaskMutation.isPending}
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="bg-white rounded-2xl shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-forest-800" data-testid="text-upcoming-tasks">
                Upcoming Quests
              </h3>
              <Badge 
                variant="secondary" 
                className="bg-blue-100 text-blue-700"
                data-testid="badge-upcoming-count"
              >
                {upcomingTasks.length} scheduled
              </Badge>
            </div>
            
            <div className="space-y-4" data-testid="list-upcoming-tasks">
              {upcomingTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming quests scheduled.</p>
                </div>
              ) : (
                upcomingTasks.slice(0, 5).map((task: Task) => (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1 w-5 h-5 border-2 border-gray-400 rounded bg-gray-200 flex-shrink-0"></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-700">{task.title}</h4>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                          </span>
                          <span className="flex items-center">
                            <Star className="w-3 h-3 mr-1 text-gray-400" />
                            {task.experienceReward || 25} XP
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {upcomingTasks.length > 5 && (
                <Button 
                  variant="ghost" 
                  className="w-full text-forest-600 hover:text-forest-800"
                  data-testid="button-view-all-upcoming"
                >
                  <ChevronDown className="w-4 h-4 mr-2" />
                  View All Upcoming Quests
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Completed Tasks Today */}
      {completedToday.length > 0 && (
        <Card className="mt-8 bg-forest-50 rounded-2xl shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-forest-800" data-testid="text-completed-today">
                Completed Quests Today
              </h3>
              <Badge 
                className="bg-forest-500 text-white"
                data-testid="badge-xp-earned"
              >
                +{totalXpToday} XP earned
              </Badge>
            </div>
            
            <div className="space-y-3" data-testid="list-completed-today">
              {completedToday.map((task: Task) => (
                <div key={task.id} className="flex items-center space-x-3 text-forest-700">
                  <i className="fas fa-check-circle text-forest-500"></i>
                  <span className="line-through opacity-75">{task.title}</span>
                  <Badge 
                    variant="secondary" 
                    className="bg-forest-200 text-forest-800 ml-auto"
                  >
                    +{task.experienceReward || 25} XP
                  </Badge>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-forest-600 italic" data-testid="text-daily-motivation">
                "Excellent work today! Your forest is flourishing with each completed quest. 🌱"
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}