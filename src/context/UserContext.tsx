import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, Constellation, Challenge, Star } from '../types';
import { mockUser } from '../data/mockData';

interface UserContextType {
  user: User;
  startConstellation: (constellationId: string) => void;
  completeChallenge: (challenge: Challenge) => void;
  abortConstellation: () => void;
  todayChallenges: Challenge[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(mockUser);

  // Get today's challenges
  const todayChallenges = user.currentConstellation?.stars
    .find(star => {
      const today = new Date().toISOString().split('T')[0];
      return star.date === today;
    })?.challenges || [];

  // Start a new constellation challenge
  const startConstellation = (templateId: string) => {
    // This would typically fetch the constellation template from an API
    // For now, we'll use mock data
    import('../data/constellations').then(({ constellationTemplates }) => {
      const template = constellationTemplates.find(t => t.id === templateId);
      if (!template) return;

      const today = new Date().toISOString().split('T')[0];
      
      const stars: Star[] = template.starPositions.map((position, index) => ({
        id: `star-${templateId}-${index}`,
        day: index + 1,
        date: index === 0 ? today : '',
        position,
        brightness: 0,
        challenges: [],
        completed: false
      }));

      const newConstellation: Constellation = {
        id: `constellation-${templateId}-${Date.now()}`,
        name: template.name,
        nameKorean: template.nameKorean,
        description: template.description,
        totalDays: template.totalDays,
        stars,
        completed: false,
        startDate: today,
        endDate: null,
        aborted: false
      };

      setUser(prev => ({
        ...prev,
        currentConstellation: newConstellation
      }));
    });
  };

  // Complete a challenge for today
  const completeChallenge = (challenge: Challenge) => {
    if (!user.currentConstellation) return;

    const today = new Date().toISOString().split('T')[0];
    
    setUser(prev => {
      if (!prev.currentConstellation) return prev;

      const updatedStars = prev.currentConstellation.stars.map(star => {
        if (star.date === today) {
          // Don't add duplicate challenges
          if (star.challenges.includes(challenge)) return star;
          
          const updatedChallenges = [...star.challenges, challenge];
          return {
            ...star,
            brightness: updatedChallenges.length,
            challenges: updatedChallenges,
            completed: true
          };
        }
        return star;
      });

      // Check if we need to activate the next star for tomorrow
      const completedDays = updatedStars.filter(s => s.completed).length;
      const totalDays = prev.currentConstellation.totalDays;
      
      let nextStars = [...updatedStars];
      if (completedDays < totalDays) {
        // Set the next day's date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        
        nextStars = updatedStars.map((star, idx) => {
          if (idx === completedDays) {
            return { ...star, date: tomorrowStr };
          }
          return star;
        });
      }

      // Check if constellation is completed
      const allCompleted = completedDays === totalDays - 1 && 
        nextStars.filter(s => s.completed).length === totalDays;
      
      if (allCompleted) {
        // Complete the constellation
        const completedConstellation = {
          ...prev.currentConstellation,
          stars: nextStars,
          completed: true,
          endDate: today
        };
        
        return {
          ...prev,
          totalConstellations: prev.totalConstellations + 1,
          currentConstellation: null,
          completedConstellations: [
            ...prev.completedConstellations,
            completedConstellation
          ]
        };
      }

      return {
        ...prev,
        currentConstellation: {
          ...prev.currentConstellation,
          stars: nextStars
        }
      };
    });
  };

  // Abort the current constellation
  const abortConstellation = () => {
    setUser(prev => {
      if (!prev.currentConstellation) return prev;

      const abortedConstellation = {
        ...prev.currentConstellation,
        aborted: true,
        endDate: new Date().toISOString().split('T')[0]
      };

      return {
        ...prev,
        currentConstellation: null,
        completedConstellations: [
          ...prev.completedConstellations,
          abortedConstellation
        ]
      };
    });
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      startConstellation, 
      completeChallenge, 
      abortConstellation,
      todayChallenges 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};