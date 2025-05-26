import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { useUser } from '../context/UserContext';
import { Button } from '../components/ui/Button';
import { User, Star, Award, Users, Settings } from 'lucide-react';
import { mockFriends } from '../data/mockData';
import { FriendProfile } from '../components/friends/FriendProfile';

export const ProfilePage: React.FC = () => {
  const { user } = useUser();
  
  return (
    <div className="max-w-2xl mx-auto">
      <GlassCard className="mb-8">
        <div className="flex items-center">
          <img 
            src={user.profileImage} 
            alt={user.name} 
            className="w-20 h-20 rounded-full border-2 border-indigo-500"
          />
          <div className="ml-6">
            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
            <div className="flex flex-wrap gap-4 mt-2">
              <div className="flex items-center text-yellow-400">
                <Star size={18} className="mr-1" />
                <span>{user.totalConstellations} 별자리</span>
              </div>
              <div className="flex items-center text-green-400">
                <Award size={18} className="mr-1" />
                <span>{user.accuracy}% 정확도</span>
              </div>
              <div className="flex items-center text-purple-400">
                <Users size={18} className="mr-1" />
                <span>{user.friends.length} 친구</span>
              </div>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            className="ml-auto"
            icon={<Settings size={18} />}
          >
            설정
          </Button>
        </div>
        
        <div className="mt-6">
          <h2 className="text-lg font-medium text-white mb-3">획득한 뱃지</h2>
          <div className="grid grid-cols-3 gap-4">
            {user.badges.map((badge) => (
              <div 
                key={badge.id} 
                className="flex flex-col items-center bg-black/30 p-4 rounded-lg"
              >
                <div className="text-2xl mb-2">{badge.icon}</div>
                <div className="text-sm font-medium text-center">{badge.name}</div>
                <div className="text-xs text-gray-400 mt-1 text-center">{badge.description}</div>
                <div className="text-xs text-indigo-400 mt-2">
                  {new Date(badge.acquiredDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
      
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <Users size={20} className="mr-2" />
        친구 목록
      </h2>
      
      {mockFriends.map((friend) => (
        <FriendProfile 
          key={friend.id}
          friend={friend}
          onViewConstellations={() => {
            // In a real app, this would navigate to the friend's constellations page
            alert(`${friend.name}님의 별자리를 볼 수 있는 페이지로 이동합니다.`);
          }}
        />
      ))}
    </div>
  );
};