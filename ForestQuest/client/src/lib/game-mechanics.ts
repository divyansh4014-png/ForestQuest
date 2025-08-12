import type { User, Task } from "@shared/schema";

export const calculateLevel = (experience: number): number => {
  return Math.floor(experience / 100) + 1;
};

export const calculateTreeStage = (experience: number): number => {
  return Math.min(Math.floor(experience / 100) + 1, 10);
};

export const getExperienceForNextLevel = (currentExperience: number): number => {
  const currentLevel = calculateLevel(currentExperience);
  return currentLevel * 100;
};

export const getExperienceProgress = (experience: number): { current: number; max: number; percentage: number } => {
  const currentLevelExp = experience % 100;
  return {
    current: currentLevelExp,
    max: 100,
    percentage: currentLevelExp,
  };
};

export const calculateTaskReward = (priority: string): number => {
  const rewards = {
    low: 10,
    medium: 25,
    high: 50,
    critical: 100,
  };
  return rewards[priority as keyof typeof rewards] || 25;
};

export const getTreeStageInfo = (stage: number) => {
  const stages = [
    { name: "Seedling", description: "Just starting to grow" },
    { name: "Sprout", description: "First leaves appearing" },
    { name: "Young Sapling", description: "Growing steadily" },
    { name: "Sapling", description: "Getting stronger" },
    { name: "Young Tree", description: "Developing a strong trunk" },
    { name: "Growing Tree", description: "Branches spreading wide" },
    { name: "Mature Tree", description: "Full of life and energy" },
    { name: "Strong Tree", description: "A pillar of the forest" },
    { name: "Ancient Tree", description: "Wise and mighty" },
    { name: "Legendary Tree", description: "A beacon of productivity" },
  ];
  return stages[Math.min(stage - 1, stages.length - 1)] || stages[0];
};

export const checkAchievements = (user: User, tasks: Task[]) => {
  const achievements = [];
  
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  // Task Master - Complete 10 tasks
  if (completedTasks.length >= 10) {
    achievements.push('task_master');
  }
  
  // Green Thumb - Reach level 5
  if (user.level >= 5) {
    achievements.push('green_thumb');
  }
  
  // Consistent - Maintain a 7-day streak
  if (user.streak >= 7) {
    achievements.push('consistent');
  }
  
  // Speed Demon - Complete 5 tasks in one day
  const today = new Date().toDateString();
  const completedToday = completedTasks.filter(task => 
    task.completedAt && new Date(task.completedAt).toDateString() === today
  );
  if (completedToday.length >= 5) {
    achievements.push('speed_demon');
  }
  
  // Precious - Complete 50 tasks total
  if (completedTasks.length >= 50) {
    achievements.push('precious');
  }
  
  // Streak Keeper - Maintain a 30-day streak
  if (user.streak >= 30) {
    achievements.push('streak_keeper');
  }
  
  return achievements;
};
