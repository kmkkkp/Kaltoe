import React, { useEffect, useState } from 'react';

const StarConstellation: React.FC = () => {
  const [animationStage, setAnimationStage] = useState(0);
  
  useEffect(() => {
    const stageTimers = [
      setTimeout(() => setAnimationStage(1), 200),
      setTimeout(() => setAnimationStage(2), 500),
      setTimeout(() => setAnimationStage(3), 800),
      setTimeout(() => setAnimationStage(4), 1100),
      setTimeout(() => setAnimationStage(5), 1400),
    ];
    
    return () => stageTimers.forEach(timer => clearTimeout(timer));
  }, []);

  // Define star positions for upward trend constellation
  const stars = [
    { id: 1, x: 40, y: 180, size: 4, color: '#FFD700', stage: 1 },
    { id: 2, x: 70, y: 150, size: 3, color: '#FFFFFF', stage: 1 },
    { id: 3, x: 100, y: 160, size: 2, color: '#87CEEB', stage: 1 },
    { id: 4, x: 130, y: 130, size: 3, color: '#FFFFFF', stage: 2 },
    { id: 5, x: 160, y: 110, size: 5, color: '#FFD700', stage: 2 },
    { id: 6, x: 190, y: 120, size: 2, color: '#87CEEB', stage: 3 },
    { id: 7, x: 220, y: 100, size: 3, color: '#FFFFFF', stage: 3 },
    { id: 8, x: 250, y: 80, size: 4, color: '#87CEEB', stage: 4 },
    { id: 9, x: 280, y: 70, size: 3, color: '#FFFFFF', stage: 4 },
    { id: 10, x: 310, y: 50, size: 5, color: '#FFD700', stage: 5 },
  ];

  // Define connections between stars to form the constellation
  const lines = [
    { id: 1, from: 1, to: 2, stage: 1 },
    { id: 2, from: 2, to: 3, stage: 1 },
    { id: 3, from: 3, to: 4, stage: 2 },
    { id: 4, from: 4, to: 5, stage: 2 },
    { id: 5, from: 5, to: 6, stage: 3 },
    { id: 6, from: 6, to: 7, stage: 3 },
    { id: 7, from: 7, to: 8, stage: 4 },
    { id: 8, from: 8, to: 9, stage: 4 },
    { id: 9, from: 9, to: 10, stage: 5 },
  ];

  // Find star by id
  const findStar = (id: number) => stars.find(star => star.id === id);

  return (
    <div className="constellation-container">
      <svg className="constellation" viewBox="0 0 350 200" xmlns="http://www.w3.org/2000/svg">
        {/* Lines connecting stars */}
        {lines.map(line => {
          const fromStar = findStar(line.from);
          const toStar = findStar(line.to);
          if (!fromStar || !toStar) return null;
          
          return (
            <line
              key={`line-${line.id}`}
              x1={fromStar.x}
              y1={fromStar.y}
              x2={toStar.x}
              y2={toStar.y}
              className={`constellation-line ${animationStage >= line.stage ? 'visible' : ''}`}
              strokeWidth="1"
              stroke="rgba(255, 255, 255, 0.6)"
            />
          );
        })}
        
        {/* Stars */}
        {stars.map(star => (
          <g key={`star-${star.id}`} className={`star-group ${animationStage >= star.stage ? 'visible' : ''}`}>
            {/* Glow effect */}
            <circle
              cx={star.x}
              cy={star.y}
              r={star.size * 3}
              className="star-glow"
              fill={`url(#glow-${star.id})`}
            />
            
            {/* Star */}
            <circle
              cx={star.x}
              cy={star.y}
              r={star.size}
              fill={star.color}
              className="star"
            />
          </g>
        ))}
        
        {/* Gradient definitions for star glows */}
        <defs>
          {stars.map(star => (
            <radialGradient key={`gradient-${star.id}`} id={`glow-${star.id}`}>
              <stop offset="0%" stopColor={star.color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={star.color} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>
      </svg>
    </div>
  );
};

export default StarConstellation;