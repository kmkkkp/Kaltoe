import React from 'react';

const SpaceBackground: React.FC = () => {
  // Generate random stars for the background
  const generateStars = (count: number) => {
    const stars = [];
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 1.5 + 0.5;
      stars.push({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: size,
        animationDelay: `${Math.random() * 3}s`,
        opacity: Math.random() * 0.7 + 0.3
      });
    }
    return stars;
  };

  const backgroundStars = generateStars(100);

  return (
    <div className="space-background">
      <div className="galaxy-gradient"></div>
      
      {backgroundStars.map(star => (
        <div
          key={`bg-star-${star.id}`}
          className="background-star"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: star.animationDelay
          }}
        />
      ))}
    </div>
  );
};

export default SpaceBackground;