import { Card, CardContent } from "@/components/ui/card";
import { Heart, Star, Flame } from "lucide-react";
import type { User } from "@shared/schema";

interface StatsCardProps {
  user: User;
}

export default function StatsCard({ user }: StatsCardProps) {
  const hitPoints = user.hitPoints || 100;
  const level = user.level || 1;
  const streak = user.streak || 0;

  return (
    <Card className="bg-white rounded-2xl shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-forest-800 mb-4" data-testid="text-stats-title">
          Vital Stats
        </h3>
        
        <div className="space-y-4">
          {/* HP */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-forest-700 flex items-center">
                <Heart className="w-4 h-4 text-red-500 mr-2" />
                Health Points
              </span>
              <span className="font-bold text-forest-800" data-testid="text-hp-value">
                {hitPoints}/100
              </span>
            </div>
            <div className="w-full bg-red-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-red-400 to-red-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${hitPoints}%` }}
                data-testid="progress-hp"
              ></div>
            </div>
          </div>
          
          {/* Level */}
          <div>
            <div className="flex justify-between items-center">
              <span className="text-forest-700 flex items-center">
                <Star className="w-4 h-4 text-yellow-500 mr-2" />
                Current Level
              </span>
              <span className="font-bold text-forest-800 text-2xl" data-testid="text-level-value">
                {level}
              </span>
            </div>
          </div>
          
          {/* Streak */}
          <div>
            <div className="flex justify-between items-center">
              <span className="text-forest-700 flex items-center">
                <Flame className="w-4 h-4 text-orange-500 mr-2" />
                Daily Streak
              </span>
              <span className="font-bold text-forest-800 text-xl" data-testid="text-streak-value">
                {streak} days
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}