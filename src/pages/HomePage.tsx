import React, { useState, useEffect } from 'react';
import { ConstellationMap } from '../components/stars/ConstellationMap';
import { Button } from '../components/ui/Button';
import { useUser } from '../context/UserContext';
import { constellationTemplates } from '../data/constellations';
import { ConstellationSelector } from '../components/stars/ConstellationSelector';
import { GlassCard } from '../components/ui/GlassCard';
import { Plus, Info, Star, Award, Medal, Flame, Trophy, X } from 'lucide-react';
import { createPortal } from 'react-dom';


const badgeIcons = {
  star: <Star size={20} />, 
  award: <Award size={20} />, 
  medal: <Medal size={20} />, 
  flame: <Flame size={20} />, 
  trophy: <Trophy size={20} />,
};

function drawStars(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const stars = [];
  const width = canvas.width;
  const height = canvas.height;
  const numStars = 60;

  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.2 + 0.8,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.5
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    stars.forEach((star) => {
      ctx.beginPath();
      ctx.globalAlpha = star.alpha;
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.globalAlpha = 1.0;

      star.x += star.dx;
      star.y += star.dy;

      if (star.x < 0 || star.x > width) star.dx *= -1;
      if (star.y < 0 || star.y > height) star.dy *= -1;
    });
    requestAnimationFrame(animate);
  }
  animate();
}

const BadgeModal = ({ badge, onClose }) => {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-sm p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl text-white">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
          <X size={20} />
        </button>
        <div className="flex flex-col items-center text-center">
          <div className="text-4xl mb-2">{badge.icon}</div>
          <h2 className="text-2xl font-bold text-indigo-300 mb-2">{badge.name}</h2>
          <p className="text-sm text-gray-300 mb-4">{badge.description}</p>
          <span className="text-xs text-indigo-400 italic">{badge.rare ? '✨ 희귀 뱃지' : '일반 뱃지'}</span>
        </div>
      </div>
    </div>,
    document.body
  );
};

export const HomePage: React.FC = () => {
  const { user, startConstellation } = useUser();
  const [showSelector, setShowSelector] = useState(false);
  const [selectedConstellation, setSelectedConstellation] = useState<string | null>(null);
  const [selectedBadge, setSelectedBadge] = useState(null);

  useEffect(() => {
    ['b6', 'b7', 'b8', 'b9'].forEach(id => {
      const canvas = document.getElementById(`canvas-${id}`) as HTMLCanvasElement;
      if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        drawStars(canvas);
      }
    });
  }, []);

  const handleStartConstellation = (templateId: string) => {
    startConstellation(templateId);
    setShowSelector(false);
  };

  const allConstellations = [
    ...(user.currentConstellation ? [user.currentConstellation] : []),
    ...user.completedConstellations,
  ];

  const handleConstellationClick = (id: string) => {
    setSelectedConstellation(id);
  };

  const selectedConstellationData = allConstellations.find((c) => c.id === selectedConstellation);

  return (
    <div className="max-w-4xl mx-auto px-4">
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">🌟 주식 별자리 챌린지</h1>
        <p className="text-indigo-200 mt-3 text-base">매일 학습하며 나만의 별자리를 완성해보세요</p>
      </header>

      {selectedBadge && (
        <BadgeModal badge={selectedBadge} onClose={() => setSelectedBadge(null)} />
      )}

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
                    매일 주식 활동을 하면서 아름다운 별자리를 완성해보세요. 연속 활동을 통해 점점 빛나는 별을 만들어 나갈 수 있습니다.
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
                  <h3 className="text-white font-bold text-xl inline-flex max-w-full whitespace-nowrap">
                    <span className="truncate">
                      {selectedConstellationData.nameKorean}
                      <span className="text-indigo-300 ml-2 text-sm">
                        ({selectedConstellationData.name})
                      </span>
                    </span>
                  </h3>
                  <p className="text-gray-300 text-sm mt-1">
                    {new Date(selectedConstellationData.startDate).toLocaleDateString()} ~{' '}
                    {selectedConstellationData.endDate
                      ? new Date(selectedConstellationData.endDate).toLocaleDateString()
                      : '진행 중'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Info size={16} />}
                  onClick={() => (window.location.href = '/history')}
                >
                  상세 기록
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-indigo-300 text-sm">총 날짜</div>
                  <div className="text-white font-medium">
                    {selectedConstellationData.stars.filter((s) => s.completed).length} / {selectedConstellationData.totalDays}일
                  </div>
                </div>
                <div>
                  <div className="text-indigo-300 text-sm">완료한 활동</div>
                  <div className="text-white font-medium">
                    {selectedConstellationData.stars.reduce((acc, star) => acc + star.challenges.length, 0)}개
                  </div>
                </div>
                <div>
                  <div className="text-indigo-300 text-sm">평균 밝기</div>
                  <div className="text-white font-medium">
                    {(
                      selectedConstellationData.stars.reduce((acc, star) => acc + star.brightness, 0) /
                      Math.max(1, selectedConstellationData.stars.filter((s) => s.completed).length)
                    ).toFixed(1)} / 3
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

  <div className="mb-4"></div>
          <GlassCard className="mt-0 mb-6 bg-black/40 p-6 rounded-2xl border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-4">✨ 아직 달성하지 못한 뱃지</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            {
              id: 'b4', icon: badgeIcons.medal, name: '끈기있는 사람',
              description: '30일 연속 활동 완료', rare: false,
            },
            {
              id: 'b5', icon: badgeIcons.flame, name: '밤하늘의 별을 바라보며',
              description: '60일 연속 활동 완료', rare: false,
            },
            {
              id: 'b6', icon: badgeIcons.trophy, name: '당신이 우리의 별이에요',
              description: '180일 연속 활동 완료', rare: true,
            },
            {
              id: 'b7', icon: badgeIcons.award, name: '내 별자리 예쁘지?',
              description: '친구 5명에게 응원받기', rare: false,
            },
            {
              id: 'b8', icon: badgeIcons.star, name: '은하수가 내 손안에',
              description: '모든 별자리 완성 시 획득', rare: true,
            },
            {
              id: 'b9', icon: badgeIcons.flame, name: '나 운이 좀 좋은 것 같아',
              description: '30일 연속 수익률 예측 성공', rare: true,
            },
          ]
            .filter(badge => !user.badges.some(acq => acq.id === badge.id))
            .map((badge) => (
              <div
                key={badge.id}
                className={`relative flex flex-col items-center p-4 rounded-xl text-center transition-all duration-200 border border-white/10 hover:shadow-lg hover:-translate-y-1 cursor-pointer ${
                  badge.rare ? 'bg-indigo-500/20 ring-2 ring-indigo-400 backdrop-blur-md' : 'bg-gradient-to-b from-black/40 to-black/20'
                }`}
                onClick={() => setSelectedBadge(badge)}
              >
                {badge.rare && (
                  <canvas
                    id={`canvas-${badge.id}`}
                    className="absolute inset-0 w-full h-full rounded-xl z-0"
                  />
                )}
                <div className="relative z-10 text-2xl mb-2">{badge.icon}</div>
                <div className="relative z-10 text-sm font-semibold text-white break-words">{badge.name}</div>
                <div className="relative z-10 text-xs text-gray-400 mt-1">{badge.description}</div>
                <div className="relative z-10 text-xs text-indigo-400 mt-2 italic">미획득</div>
              </div>
            ))}
        </div>
      </GlassCard>
        </>
      )}
    </div>
  );
};
