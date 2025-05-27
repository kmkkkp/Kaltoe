import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { useUser } from '../context/UserContext';
import { ConstellationMap } from '../components/stars/ConstellationMap';
import { Button } from '../components/ui/Button';
import { Calendar, Star, AlertCircle } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { user } = useUser();
  
  const allConstellations = [
    ...(user.currentConstellation ? [user.currentConstellation] : []),
    ...user.completedConstellations
  ];
  
  // Sort by start date (newest first)
  const sortedConstellations = [...allConstellations].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white text-center">나의 별자리 히스토리</h1>
        <p className="text-indigo-200 text-center mt-2">
          지금까지 완성하거나 도전했던 별자리들을 확인해보세요
        </p>
      </header>
      
      {sortedConstellations.length === 0 ? (
        <GlassCard className="py-12 text-center">
          <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
          <h2 className="text-xl font-medium text-white mb-2">아직 히스토리가 없습니다</h2>
          <p className="text-indigo-200 mb-4">
            첫 번째 별자리 도전을 시작해보세요!
          </p>
          <Button
            variant="primary"
            onClick={() => window.location.href = '/'}
          >
            홈으로 이동
          </Button>
        </GlassCard>
      ) : (
        <div className="space-y-6">
          {sortedConstellations.map((constellation) => (
            <GlassCard key={constellation.id} className="p-0 overflow-hidden">
              <div className="p-4 bg-black/30 border-b border-indigo-900/30">
                <div className="flex justify-between items-center">
                  <div>
                    <h3
                      className="text-white font-bold text-xl inline-flex max-w-full whitespace-nowrap"
                      style={{
                        fontSize: 'clamp(12px, 4vw, 20px)', // 반응형 --> 글자 크기 자동 조절
                      }}
                    >
                      <span className="truncate">
                        {constellation.nameKorean}
                        <span className="text-indigo-300 ml-2 text-sm">
                          ({constellation.name})
                        </span>
                      </span>
                    </h3>
                    <div className="flex items-center text-gray-300 text-sm mt-1">
                      <Calendar size={14} className="mr-1" />
                      <span>
                        {new Date(constellation.startDate).toLocaleDateString()} ~ 
                        {constellation.endDate 
                          ? new Date(constellation.endDate).toLocaleDateString() 
                          : '진행 중'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {constellation.completed ? (
                      <div className="flex items-center bg-green-900/30 text-green-300 text-sm px-3 py-1 rounded-full">
                        <Star size={14} className="mr-1" />
                        완성
                      </div>
                    ) : constellation.aborted ? (
                      <div className="flex items-center bg-red-900/30 text-red-300 text-sm px-3 py-1 rounded-full">
                        <AlertCircle size={14} className="mr-1" />
                        중단됨
                      </div>
                    ) : (
                      <div className="flex items-center bg-yellow-900/30 text-yellow-300 text-sm px-3 py-1 rounded-full">
                        <Star size={14} className="mr-1" />
                        진행 중
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="h-64">
                <ConstellationMap 
                  constellations={[constellation]}
                  isInteractive={true}
                  showLabels={true}
                />
              </div>
              
              <div className="p-4 bg-black/30 border-t border-indigo-900/30">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-indigo-300 text-sm">총 날짜</div>
                    <div className="text-white font-medium">
                      {constellation.stars.filter(s => s.completed).length} / {constellation.totalDays}일
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-indigo-300 text-sm">완료한 활동</div>
                    <div className="text-white font-medium">
                      {constellation.stars.reduce((acc, star) => acc + star.challenges.length, 0)}개
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-indigo-300 text-sm">평균 밝기</div>
                    <div className="text-white font-medium">
                      {(constellation.stars.reduce((acc, star) => acc + star.brightness, 0) / 
                        Math.max(1, constellation.stars.filter(s => s.completed).length)).toFixed(1)} / 3
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};