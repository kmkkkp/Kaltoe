import React from 'react';
import { User } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { Award, Star, Heart } from 'lucide-react';

interface FriendProfileProps {
  friend: User;
  onViewConstellations: () => void;
}

export const FriendProfile: React.FC<FriendProfileProps> = ({ friend, onViewConstellations }) => {
  return (
    <GlassCard className="mb-6">
      <div className="flex items-center">
        <img 
          src={friend.profileImage} 
          alt={friend.name} 
          className="w-16 h-16 rounded-full border-2 border-indigo-500/50"
        />
        
        <div className="ml-4">
          <h2 className="text-xl font-bold text-white">{friend.name}</h2>
          <div className="flex items-center mt-1">
            <div className="flex items-center text-yellow-400 mr-4">
              <Star size={16} className="mr-1" />
              <span className="text-sm">{friend.totalConstellations} 별자리</span>
            </div>
            <div className="flex items-center text-green-400">
              <Award size={16} className="mr-1" />
              <span className="text-sm">{friend.accuracy}% 정확도</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-sm font-medium text-indigo-300 mb-2">획득한 뱃지</h3>
        <div className="flex space-x-2">
          {friend.badges.map((badge) => (
            <div 
              key={badge.id} 
              className="flex flex-col items-center bg-black/30 p-2 rounded-lg"
              title={badge.description}
            >
              <span className="text-lg">{badge.icon}</span>
              <span className="text-xs mt-1 text-gray-300">{badge.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm"
          icon={<Heart size={16} />}
        >
          응원하기
        </Button>
        <Button 
          variant="primary" 
          size="sm"
          onClick={onViewConstellations}
        >
          별자리 구경하기
        </Button>
      </div>
    </GlassCard>
  );
};