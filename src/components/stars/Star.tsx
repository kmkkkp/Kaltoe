import React from 'react';
import { Star as StarType } from '../../types';

interface StarProps {
  star: StarType;
  onClick?: () => void;
  isActive?: boolean;
  isConnected?: boolean;
  showLabel?: boolean;
  size?: number;
}

export const Star: React.FC<StarProps> = ({
  star,
  onClick,
  isActive = false,
  isConnected = false,
  showLabel = false,
  size = 12,
}) => {
  // Calculate colors based on brightness
  const getStarColor = (brightness: number, active: boolean) => {
    if (!active) return 'rgba(255, 255, 255, 0.3)';
    
    switch (brightness) {
      case 3: return '#FFD700'; // Gold for all 3 challenges
      case 2: return '#E6E6FA'; // Light purple for 2 challenges
      case 1: return '#ADD8E6'; // Light blue for 1 challenge
      default: return 'rgba(255, 255, 255, 0.5)';
    }
  };
  
  const baseSize = size;
  const glowSize = baseSize * 2;
  const actualSize = star.brightness > 0 ? baseSize + (star.brightness * 2) : baseSize;
  
  const fillColor = getStarColor(star.brightness, star.completed);
  const glowOpacity = star.completed ? 0.6 : 0.2;
  const glowColor = star.completed ? fillColor : 'rgba(255, 255, 255, 0.2)';
  
  return (
    <div 
      className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
      style={{ 
        left: `${star.position.x}%`, 
        top: `${star.position.y}%`,
      }}
      onClick={onClick}
    >
      {/* The star glow */}
      <div
        className="absolute rounded-full transition-all duration-300 animate-pulse"
        style={{
          width: `${glowSize}px`,
          height: `${glowSize}px`,
          backgroundColor: glowColor,
          opacity: glowOpacity,
          filter: `blur(${glowSize/2}px)`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
      
      {/* The star itself */}
      <div
        className={`rounded-full transition-all duration-300 ${
          isActive ? 'animate-ping-slow' : ''
        }`}
        style={{
          width: `${actualSize}px`,
          height: `${actualSize}px`,
          backgroundColor: fillColor,
          position: 'relative',
          zIndex: 10,
        }}
      />
      
      {/* Label */}
      {showLabel && (
        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/70 text-white text-xs p-1 rounded whitespace-nowrap z-20 -mt-8 left-1/2 transform -translate-x-1/2">
          {star.date ? `Day ${star.day}: ${star.date}` : `Day ${star.day}`}
          {star.completed && (
            <div className="flex mt-1 space-x-1 justify-center">
              {star.challenges.map((challenge, i) => (
                <span 
                  key={i} 
                  className={`w-2 h-2 rounded-full ${
                    challenge === 'quiz' ? 'bg-blue-400' : 
                    challenge === 'writing' ? 'bg-green-400' : 'bg-purple-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};