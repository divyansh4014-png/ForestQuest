import { useUser } from "@/hooks/use-user";
import TreeAvatar from "@/components/tree-avatar";
import StatsCard from "@/components/stats-card";
import AchievementsGrid from "@/components/achievements-grid";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Plus, TrendingUp, SkipForward } from "lucide-react";

export default function Dashboard() {
  const { user, isLoading, hasSkipped, skipAccountCreation } = useUser();

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-20 bg-white rounded-2xl"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-96 bg-white rounded-2xl"></div>
            <div className="space-y-6">
              <div className="h-48 bg-white rounded-2xl"></div>
              <div className="h-64 bg-white rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user && !hasSkipped) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-forest-800 mb-4">Welcome to ForestQuest!</h2>
          <p className="text-forest-600 mb-6">Create your account to start growing your productivity tree, or skip to explore the app.</p>
          <div className="space-x-4">
            <Button 
              className="bg-forest-500 hover:bg-forest-600"
              data-testid="button-create-account"
            >
              Create Account
            </Button>
            <Button 
              variant="outline"
              onClick={skipAccountCreation}
              className="border-forest-300 text-forest-600 hover:bg-forest-50"
              data-testid="button-skip-account"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Skip & Explore
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (hasSkipped && !user) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Header for Guest */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-forest-800 mb-2" data-testid="text-welcome-header">
            Welcome to ForestQuest!
          </h2>
          <p className="text-forest-600 text-lg" data-testid="text-welcome-message">
            You're exploring as a guest. Create an account to save your progress and grow your tree!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Demo Tree Section */}
          <div className="lg:col-span-2">
            <Card className="bg-white rounded-2xl shadow-lg">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold text-forest-800 mb-6" data-testid="text-tree-title">
                  Your Growing Tree (Preview)
                </h3>
                
                {/* Demo tree avatar */}
                <div className="relative mx-auto w-64 h-80 mb-6" data-testid="tree-avatar">
                  <div className="absolute inset-0 bg-gradient-to-b from-forest-100 to-forest-200 rounded-2xl overflow-hidden">
                    <div className="absolute bottom-0 w-full h-16 bg-amber-200 rounded-b-2xl"></div>
                    <div className="absolute top-4 left-4 w-8 h-4 bg-white/60 rounded-full"></div>
                    <div className="absolute top-6 right-8 w-6 h-3 bg-white/40 rounded-full"></div>
                  </div>
                  
                  <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 bg-amber-700 rounded-t-lg mx-auto h-20"></div>
                    <div className="relative -mt-12">
                      <div className="bg-forest-500 rounded-full mx-auto shadow-lg w-24 h-24"></div>
                      <div className="absolute -top-2 left-2 bg-forest-400 rounded-full opacity-80 w-16 h-16"></div>
                      <div className="absolute top-1 right-1 bg-forest-600 rounded-full opacity-70 w-14 h-14"></div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-forest-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Level 1 Seedling
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  <div className="bg-forest-50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-forest-700 font-medium">Growth Progress</span>
                      <span className="text-forest-600 text-sm" data-testid="text-xp-progress">
                        0/100 XP
                      </span>
                    </div>
                    <div className="w-full bg-forest-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-forest-400 to-forest-500 h-3 rounded-full w-0"></div>
                    </div>
                  </div>
                  
                  <p className="text-forest-600 text-sm italic" data-testid="text-motivation">
                    "Complete tasks to watch your tree grow and flourish!"
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Stats & Actions */}
          <div className="space-y-6">
            
            <Card className="bg-white rounded-2xl shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-forest-800 mb-4" data-testid="text-stats-title">
                  Preview Stats
                </h3>
                
                <div className="space-y-4 text-gray-500">
                  <div className="text-center py-4">
                    <i className="fas fa-lock text-2xl mb-2"></i>
                    <p className="text-sm">Create an account to track your progress and unlock achievements!</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white rounded-2xl shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-forest-800 mb-4">Get Started</h3>
                <div className="space-y-3">
                  <Link href="/tasks">
                    <Button 
                      className="w-full bg-forest-500 hover:bg-forest-600 text-white font-medium"
                      data-testid="button-explore-tasks"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Explore Tasks
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full bg-forest-100 hover:bg-forest-200 text-forest-700 border-forest-200"
                    data-testid="button-create-account"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Create Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // User has an account
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-forest-800 mb-2" data-testid="text-welcome-header">
          Welcome back, Forest Guardian!
        </h2>
        <p className="text-forest-600 text-lg" data-testid="text-welcome-message">
          Your tree is growing strong! Complete your quests to nurture the forest.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Avatar Section */}
        <div className="lg:col-span-2">
          <Card className="bg-white rounded-2xl shadow-lg">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold text-forest-800 mb-6" data-testid="text-tree-title">
                Your Growing Tree
              </h3>
              
              <TreeAvatar user={user!} />

              <div className="space-y-3 mt-6">
                <div className="bg-forest-50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-forest-700 font-medium">Growth Progress</span>
                    <span className="text-forest-600 text-sm" data-testid="text-xp-progress">
                      {user!.experience || 0}/1000 XP
                    </span>
                  </div>
                  <div className="w-full bg-forest-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-forest-400 to-forest-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(((user!.experience || 0) % 1000) / 10, 100)}%` }}
                      data-testid="progress-xp"
                    ></div>
                  </div>
                </div>
                
                <p className="text-forest-600 text-sm italic" data-testid="text-motivation">
                  "Your dedication is showing! {1000 - ((user!.experience || 0) % 1000)} XP until your next growth stage."
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats & Achievements */}
        <div className="space-y-6">
          
          <StatsCard user={user!} />
          
          <AchievementsGrid userId={user!.id} />

          {/* Quick Actions */}
          <Card className="bg-white rounded-2xl shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-forest-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/tasks">
                  <Button 
                    className="w-full bg-forest-500 hover:bg-forest-600 text-white font-medium"
                    data-testid="button-add-task"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Task
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full bg-forest-100 hover:bg-forest-200 text-forest-700 border-forest-200"
                  data-testid="button-view-progress"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}