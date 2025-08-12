import { Link, useLocation } from "wouter";
import { Home, CheckSquare, User } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-forest-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-forest-500 rounded-lg flex items-center justify-center">
              <i className="fas fa-tree text-white text-sm"></i>
            </div>
            <h1 className="text-xl font-bold text-forest-800" data-testid="text-app-title">
              ForestQuest
            </h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link href="/">
              <button 
                className={`nav-btn flex items-center ${isActive("/") ? "active" : ""}`}
                data-testid="nav-dashboard"
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </button>
            </Link>
            
            <Link href="/tasks">
              <button 
                className={`nav-btn flex items-center ${isActive("/tasks") ? "active" : ""}`}
                data-testid="nav-tasks"
              >
                <CheckSquare className="w-4 h-4 mr-2" />
                Tasks
              </button>
            </Link>
            
            <div className="w-8 h-8 bg-forest-200 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-forest-600" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}