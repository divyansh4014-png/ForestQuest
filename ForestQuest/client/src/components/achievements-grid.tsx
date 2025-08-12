import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import type { Achievement, UserAchievement } from "@shared/schema";

interface AchievementsGridProps {
  userId: string;
}

export default function AchievementsGrid({ userId }: AchievementsGridProps) {
  const { data: achievements = [] } = useQuery({
    queryKey: ['/api/achievements'],
  });

  const { data: userAchievements = [] } = useQuery({
    queryKey: ['/api/users', userId, 'achievements'],
    enabled: !!userId,
  });

  const unlockedAchievementIds = new Set(
    (userAchievements as UserAchievement[]).map((ua: UserAchievement) => ua.achievementId)
  );

  return (
    <Card className="bg-white rounded-2xl shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-forest-800 mb-4" data-testid="text-achievements-title">
          Recent Achievements
        </h3>
        
        <div className="grid grid-cols-3 gap-3">
          {(achievements as Achievement[]).slice(0, 6).map((achievement: Achievement) => {
            const isUnlocked = unlockedAchievementIds.has(achievement.id);
            
            return (
              <div
                key={achievement.id}
                className={`rounded-lg p-3 text-center text-white shadow-md transition-all ${
                  isUnlocked
                    ? `bg-gradient-to-br ${achievement.color}`
                    : "bg-gray-200 text-gray-400 border-2 border-dashed border-gray-300"
                }`}
                data-testid={`achievement-${achievement.id}`}
              >
                <i className={`${achievement.icon} text-lg mb-1`}></i>
                <p className="text-xs font-medium">{achievement.name}</p>
                {!isUnlocked && (
                  <i className="fas fa-lock text-sm mt-1 opacity-50"></i>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}