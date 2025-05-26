import React, { useState } from 'react';
import { ConstellationMap } from '../components/stars/ConstellationMap';
import { Button } from '../components/ui/Button';
import { useUser } from '../context/UserContext';
import { constellationTemplates } from '../data/constellations';
import { ConstellationSelector } from '../components/stars/ConstellationSelector';
import { GlassCard } from '../components/ui/GlassCard';
import { Plus, Info } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user, startConstellation } = useUser();
  const [showSelector, setShowSelector] = useState(false);
  const [selectedConstellation, setSelectedConstellation] = useState<string | null>(null);
  
  const handleStartConstellation = (templateId: string) => {
    startConstellation(templateId);
    setShowSelector(false);
  };

  const allConstellations = [
    ...(user.currentConstellation ? [user.currentConstellation] : []),
    ...user.completedConstellations
  ];

  const handleConstellationClick = (id: string) => {
    setSelectedConstellation(id);
  };

  const selectedConstellationData = allConstellations.find(c => c.id === selectedConstellation);

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white text-center">주식 별자리 챌린지</h1>
        <p className="text-indigo-200 text-center mt-2">
          매일 학습하며 나만의 별자리를 완성해보세요
        </p>
      </header>

      {showSelector ? (
        <ConstellationSelector 
          constellationTemplates={constellationTemplates} 
          onSelect={handleStartConstellation} 
        />
      ) : (
        <>
          <div className="relative bg-black/30 backdrop-blur-sm rounded-2xl p-4 mb-6 min-h-[500px]">
            {allConstellations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">새로운 별자리 도전</h2>
                  <p className="text-indigo-200 max-w-md">
                    매일 주식 활동을 하면서 아름다운 별자리를 완성해보세요.
                    연속 활동을 통해 점점 빛나는 별을 만들어 나갈 수 있습니다.
                  </p>
                </div>
                
                <Button 
                  variant="primary"
                  size="lg"
                  icon={<Plus size={20} />}
                  onClick={() => setShowSelector(true)}
                  className="animate-pulse-slow"
                >
                  새로운 별자리 시작하기
                </Button>
              </div>
            ) : (
              <>
                <div className="absolute top-4 right-4 z-10">
                  {!user.currentConstellation && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<Plus size={16} />}
                      onClick={() => setShowSelector(true)}
                    >
                      새 별자리 시작
                    </Button>
                  )}
                </div>
                
                <div className="h-[500px]">
                  <ConstellationMap 
                    constellations={allConstellations}
                    onConstellationClick={handleConstellationClick}
                    isInteractive={true}
                    showLabels={true}
                  />
                </div>
              </>
            )}
          </div>
          
          {selectedConstellationData && (
            <GlassCard className="mt-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedConstellationData.nameKorean}
                    <span className="text-indigo-300 ml-2 text-sm">
                      ({selectedConstellationData.name})
                    </span>
                  </h3>
                  <p className="text-gray-300 text-sm mt-1">
                    {new Date(selectedConstellationData.startDate).toLocaleDateString()} ~ 
                    {selectedConstellationData.endDate 
                      ? new Date(selectedConstellationData.endDate).toLocaleDateString()
                      : '진행 중'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Info size={16} />}
                  onClick={() => window.location.href = '/history'}
                >
                  상세 기록
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-indigo-300 text-sm">총 날짜</div>
                  <div className="text-white font-medium">
                    {selectedConstellationData.stars.filter(s => s.completed).length} / 
                    {selectedConstellationData.totalDays}일
                  </div>
                </div>
                <div>
                  <div className="text-indigo-300 text-sm">완료한 활동</div>
                  <div className="text-white font-medium">
                    {selectedConstellationData.stars.reduce((acc, star) => 
                      acc + star.challenges.length, 0)}개
                  </div>
                </div>
                <div>
                  <div className="text-indigo-300 text-sm">평균 밝기</div>
                  <div className="text-white font-medium">
                    {(selectedConstellationData.stars.reduce((acc, star) => 
                      acc + star.brightness, 0) / 
                      Math.max(1, selectedConstellationData.stars.filter(s => 
                        s.completed).length)).toFixed(1)} / 3
                  </div>
                </div>
              </div>
            </GlassCard>
          )}
        </>
      )}
    </div>
  );
};