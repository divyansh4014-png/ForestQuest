import type { User } from "@shared/schema";

interface TreeAvatarProps {
  user: User;
}

export default function TreeAvatar({ user }: TreeAvatarProps) {
  const getTreeStageInfo = (stage: number) => {
    const stages = [
      { name: "Seedling", color: "text-green-600" },
      { name: "Sprout", color: "text-green-600" },
      { name: "Young Sapling", color: "text-forest-500" },
      { name: "Sapling", color: "text-forest-500" },
      { name: "Young Tree", color: "text-forest-600" },
      { name: "Growing Tree", color: "text-forest-600" },
      { name: "Mature Tree", color: "text-forest-700" },
      { name: "Strong Tree", color: "text-forest-700" },
      { name: "Ancient Tree", color: "text-forest-800" },
      { name: "Legendary Tree", color: "text-forest-900" },
    ];
    return stages[Math.min(stage - 1, stages.length - 1)] || stages[0];
  };

  const treeStage = user.treeStage || 1;
  const level = user.level || 1;
  const experience = user.experience || 0;
  
  const stageInfo = getTreeStageInfo(treeStage);
  const crownSize = Math.min(24 + treeStage * 2, 32); // Grows from 24 to 32
  const trunkHeight = Math.min(20 + treeStage, 28); // Grows from 20 to 28

  return (
    <div className="relative mx-auto w-64 h-80 mb-6" data-testid="tree-avatar">
      {/* Background forest scene */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-100 to-forest-200 rounded-2xl overflow-hidden">
        {/* Ground */}
        <div className="absolute bottom-0 w-full h-16 bg-amber-200 rounded-b-2xl"></div>
        
        {/* Clouds */}
        <div className="absolute top-4 left-4 w-8 h-4 bg-white/60 rounded-full"></div>
        <div className="absolute top-6 right-8 w-6 h-3 bg-white/40 rounded-full"></div>
        
        {/* Sun (appears as tree grows) */}
        {treeStage >= 5 && (
          <div className="absolute top-6 right-6 w-6 h-6 bg-yellow-300 rounded-full opacity-70"></div>
        )}
      </div>
      
      {/* Main Tree */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
        {/* Trunk */}
        <div 
          className="w-8 bg-amber-700 rounded-t-lg mx-auto transition-all duration-700"
          style={{ height: `${trunkHeight * 4}px` }}
          data-testid="tree-trunk"
        ></div>
        
        {/* Tree Crown */}
        <div className="relative -mt-12">
          <div 
            className={`bg-forest-500 rounded-full mx-auto shadow-lg transition-all duration-700`}
            style={{ width: `${crownSize * 4}px`, height: `${crownSize * 4}px` }}
            data-testid="tree-crown"
          ></div>
          <div 
            className={`absolute -top-2 left-2 bg-forest-400 rounded-full opacity-80 transition-all duration-700`}
            style={{ width: `${(crownSize - 8) * 4}px`, height: `${(crownSize - 8) * 4}px` }}
          ></div>
          <div 
            className={`absolute top-1 right-1 bg-forest-600 rounded-full opacity-70 transition-all duration-700`}
            style={{ width: `${(crownSize - 10) * 4}px`, height: `${(crownSize - 10) * 4}px` }}
          ></div>
          
          {/* Leaves/Details */}
          {treeStage >= 3 && (
            <>
              <div className="absolute -top-1 left-6 w-3 h-3 bg-forest-300 rounded-full animate-bounce-gentle"></div>
              <div className="absolute top-3 right-4 w-2 h-2 bg-forest-300 rounded-full animate-bounce-gentle" style={{animationDelay: '0.5s'}}></div>
            </>
          )}
          
          {/* Flowers (high-level trees) */}
          {treeStage >= 7 && (
            <>
              <div className="absolute top-2 left-8 w-2 h-2 bg-pink-400 rounded-full"></div>
              <div className="absolute top-6 right-6 w-2 h-2 bg-yellow-400 rounded-full"></div>
            </>
          )}
        </div>
        
        {/* Growth sparkles */}
        {experience > 0 && (
          <>
            <div className="absolute -top-8 left-8 text-yellow-400 animate-sparkle">
              <i className="fas fa-sparkles"></i>
            </div>
            <div className="absolute -top-4 right-6 text-yellow-400 animate-sparkle" style={{animationDelay: '0.3s'}}>
              <i className="fas fa-star"></i>
            </div>
          </>
        )}
      </div>
      
      {/* Level indicator */}
      <div 
        className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-forest-600 text-white px-3 py-1 rounded-full text-sm font-medium`}
        data-testid="tree-level-indicator"
      >
        Level {level} {stageInfo.name}
      </div>
    </div>
  );
}