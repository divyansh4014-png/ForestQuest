import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface TaskFormProps {
  userId: string;
}

export default function TaskForm({ userId }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Personal",
    priority: "medium" as const,
    dueDate: "",
    estimatedTime: "1hour",
    experienceReward: 25,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createTaskMutation = useMutation({
    mutationFn: async (taskData: typeof formData) => {
      const response = await apiRequest('POST', `/api/users/${userId}/tasks`, {
        ...taskData,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'tasks'] });
      setFormData({
        title: "",
        description: "",
        category: "Personal",
        priority: "medium",
        dueDate: "",
        estimatedTime: "1hour",
        experienceReward: 25,
      });
      toast({
        title: "Quest planted successfully! 🌱",
        description: "Your new task has been added to the forest.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task name.",
        variant: "destructive",
      });
      return;
    }
    createTaskMutation.mutate(formData);
  };

  const handlePriorityChange = (priority: string) => {
    const xpRewards = {
      low: 10,
      medium: 25,
      high: 50,
      critical: 100,
    };
    setFormData(prev => ({
      ...prev,
      priority: priority as any,
      experienceReward: xpRewards[priority as keyof typeof xpRewards],
    }));
  };

  return (
    <Card className="bg-white rounded-2xl shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-forest-800 mb-4" data-testid="text-form-title">
          Plant a New Quest
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" className="text-forest-700 font-medium">Task Name</Label>
              <Input
                id="title"
                type="text"
                placeholder="What quest will you embark on?"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="border-forest-300 focus:ring-forest-500 focus:border-transparent"
                data-testid="input-task-title"
              />
            </div>
            <div>
              <Label htmlFor="category" className="text-forest-700 font-medium">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger 
                  className="border-forest-300 focus:ring-forest-500 focus:border-transparent"
                  data-testid="select-category"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Work & Career">Work & Career</SelectItem>
                  <SelectItem value="Health & Fitness">Health & Fitness</SelectItem>
                  <SelectItem value="Learning & Skills">Learning & Skills</SelectItem>
                  <SelectItem value="Personal Projects">Personal Projects</SelectItem>
                  <SelectItem value="Daily Habits">Daily Habits</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="dueDate" className="text-forest-700 font-medium">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="border-forest-300 focus:ring-forest-500 focus:border-transparent"
                data-testid="input-due-date"
              />
            </div>
            <div>
              <Label htmlFor="priority" className="text-forest-700 font-medium">Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={handlePriorityChange}
              >
                <SelectTrigger 
                  className="border-forest-300 focus:ring-forest-500 focus:border-transparent"
                  data-testid="select-priority"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (10 XP)</SelectItem>
                  <SelectItem value="medium">Medium (25 XP)</SelectItem>
                  <SelectItem value="high">High (50 XP)</SelectItem>
                  <SelectItem value="critical">Critical (100 XP)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="estimatedTime" className="text-forest-700 font-medium">Estimated Time</Label>
              <Select 
                value={formData.estimatedTime} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, estimatedTime: value }))}
              >
                <SelectTrigger 
                  className="border-forest-300 focus:ring-forest-500 focus:border-transparent"
                  data-testid="select-estimated-time"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15min">15 minutes</SelectItem>
                  <SelectItem value="30min">30 minutes</SelectItem>
                  <SelectItem value="1hour">1 hour</SelectItem>
                  <SelectItem value="2+hours">2+ hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description" className="text-forest-700 font-medium">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add any additional details about your quest..."
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="border-forest-300 focus:ring-forest-500 focus:border-transparent"
              data-testid="textarea-description"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={createTaskMutation.isPending}
            className="w-full md:w-auto bg-forest-500 hover:bg-forest-600 text-white font-medium"
            data-testid="button-submit-task"
          >
            <Plus className="w-4 h-4 mr-2" />
            {createTaskMutation.isPending ? "Planting..." : "Plant This Quest"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}