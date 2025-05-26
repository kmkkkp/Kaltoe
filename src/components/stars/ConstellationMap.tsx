import React, { useState, useRef } from 'react';
import { Constellation } from '../../types';
import { Star } from './Star';
import { useGesture } from '../../hooks/useGesture';

interface ConstellationMapProps {
  constellations: Constellation[];
  onConstellationClick?: (id: string) => void;
  isInteractive?: boolean;
  showLabels?: boolean;
  showLines?: boolean;
}

export const ConstellationMap: React.FC<ConstellationMapProps> = ({
  constellations,
  onConstellationClick,
  isInteractive = true,
  showLabels = true,
  showLines = true,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useGesture(
    {
      onDrag: ({ movement: [mx, my], first, memo }) => {
        if (first) {
          memo = { x: position.x, y: position.y };
        }
        setPosition({
          x: memo.x + mx / scale,
          y: memo.y + my / scale,
        });
        return memo;
      },
      onPinch: ({ offset: [s] }) => {
        setScale(Math.min(Math.max(0.5, s), 3));
      },
      onWheel: ({ delta: [, dy] }) => {
        setScale((current) => Math.min(Math.max(0.5, current - dy * 0.005), 3));
      },
    },
    {
      target: mapRef,
      enabled: isInteractive,
      drag: { filterTaps: true },
    }
  );

  const renderConstellationLines = (constellation: Constellation) => {
    if (!showLines) return null;
    
    const completedStars = constellation.stars.filter(star => star.completed);
    
    if (completedStars.length < 2) return null;
    
    return completedStars.map((star, index) => {
      if (index === 0) return null;
      
      const prevStar = completedStars[index - 1];
      
      return (
        <line
          key={`line-${constellation.id}-${star.id}`}
          x1={`${prevStar.position.x}%`}
          y1={`${prevStar.position.y}%`}
          x2={`${star.position.x}%`}
          y2={`${star.position.y}%`}
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="1"
          strokeDasharray={constellation.completed ? "0" : "5,5"}
          className={constellation.completed ? "" : "animate-dash"}
        />
      );
    });
  };

  return (
    <div 
      ref={mapRef} 
      className="relative w-full h-full overflow-hidden bg-transparent rounded-lg"
    >
      <div
        className="absolute w-full h-full transition-transform duration-300"
        style={{
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          transformOrigin: 'center',
        }}
      >
        {constellations.map((constellation) => (
          <div
            key={constellation.id}
            
            onClick={() => onConstellationClick?.(constellation.id)}
          >
            {/* SVG for lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {renderConstellationLines(constellation)}
            </svg>
            
            {/* Stars */}
            {constellation.stars.map((star) => (
              <Star
                key={star.id}
                star={star}
                isActive={star.date === new Date().toISOString().split('T')[0]}
                showLabel={showLabels}
                size={12}
              />
            ))}
            
            {/* Constellation name */}
            {constellation.completed && showLabels && (
              <div 
                className="absolute pointer-events-none text-center"
                style={{
                  left: '50%',
                  top: '90%',
                  transform: 'translate(-50%, -50%)',
                  opacity: 0.8,
                }}
              >

              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Zoom controls */}
      {isInteractive && (
        <div className="absolute bottom-4 right-4 flex flex-col space-y-2 z-10">
          <button
            className="w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
            onClick={() => setScale((s) => Math.min(s + 0.2, 3))}
          >
            +
          </button>
          <button
            className="w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
            onClick={() => setScale((s) => Math.max(s - 0.2, 0.5))}
          >
            -
          </button>
          <button
            className="w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
            onClick={() => {
              setScale(1);
              setPosition({ x: 0, y: 0 });
            }}
          >
            ↻
          </button>
        </div>
      )}
    </div>
  );
};