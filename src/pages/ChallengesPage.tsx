import React from 'react';
import { ChallengeCard } from '../components/challenges/ChallengeCard';
import { useUser } from '../context/UserContext';
import { Challenge } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { ArrowRight, Award, Star } from 'lucide-react';

export const ChallengesPage: React.FC = () => {
  const { user, completeChallenge, todayChallenges } = useUser();
  
  const handleStartChallenge = (challenge: Challenge) => {
    // In a real app, this would navigate to the challenge screen
    // For now, we'll simulate completing the challenge
    completeChallenge(challenge);
  };
  
  const isCompleted = (challenge: Challenge) => {
    return todayChallenges.includes(challenge);
  };
  
  // Calculate today's progress
  const completedCount = todayChallenges.length;
  const progressPercentage = (completedCount / 3) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white text-center">오늘의 챌린지</h1>
        <p className="text-indigo-200 text-center mt-2">
          매일 새로운 활동을 통해 별을 밝혀보세요
        </p>
      </header>
      
      {user.currentConstellation ? (
        <>
          <GlassCard className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Star className="mr-2 text-yellow-400" size={20} />
                {user.currentConstellation.nameKorean}
              </h2>
              <div className="text-sm text-indigo-300">
                Day {user.currentConstellation.stars.filter(s => s.completed).length} / {user.currentConstellation.totalDays}
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-300">오늘의 진행 상황</div>
                <div className="text-sm font-medium text-white">{completedCount}/3</div>
              </div>
              <div className="w-full bg-black/50 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            
            {completedCount === 3 && (
              <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                <div className="flex items-center">
                  <Award className="text-green-400 mr-2" size={20} />
                  <div className="text-green-300 font-medium">오늘의 모든 챌린지를 완료했습니다!</div>
                </div>
                <div className="text-gray-300 text-sm mt-1">
                  내일 새로운 챌린지가 기다리고 있어요.
                </div>
              </div>
            )}
          </GlassCard>
          
          <div className="space-y-4">
            <ChallengeCard 
              type="quiz" 
              isCompleted={isCompleted('quiz')}
              onStart={() => handleStartChallenge('quiz')}
            />
            
            <ChallengeCard 
              type="writing" 
              isCompleted={isCompleted('writing')}
              onStart={() => handleStartChallenge('writing')}
            />
            
            <ChallengeCard 
              type="prediction" 
              isCompleted={isCompleted('prediction')}
              onStart={() => handleStartChallenge('prediction')}
            />
          </div>
        </>
      ) : (
        <GlassCard className="text-center py-8">
          <div className="text-xl font-medium text-white mb-4">
            아직 진행 중인 별자리가 없습니다
          </div>
          <p className="text-indigo-200 mb-6">
            홈 화면에서 새로운 별자리 도전을 시작해보세요
          </p>
          <a 
            href="/"
            className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>홈으로 이동하기</span>
            <ArrowRight size={16} className="ml-1" />
          </a>
        </GlassCard>
      )}
    </div>
  );
};