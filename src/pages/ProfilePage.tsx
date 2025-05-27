import React, { useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { useUser } from '../context/UserContext';
import { Button } from '../components/ui/Button';
import {
  Settings, Star, Award, Users,
  Medal, Flame, Trophy, Sparkles
} from 'lucide-react';
import { mockFriends } from '../data/mockData';
import { FriendProfile } from '../components/friends/FriendProfile';
import { constellationTemplates } from '../data/constellations';

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
  //animate();
}

function drawConstellation(canvas, template) {
  if (!canvas || !template) return;
  const ctx = canvas.getContext('2d');
  
  console.log(template);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 1.5;
  ctx.fillStyle = '#ffffff';

  for (let i = 0; i < template.starPositions.length; i++) {
    const star = template.starPositions[i];
    const x = (star.x / 100) * canvas.width;
    const y = (star.y / 100) * canvas.height;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.shadowColor = 'violet';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;

    if (i > 0) {
      const prev = template.starPositions[i - 1];
      const prevX = (prev.x / 100) * canvas.width;
      const prevY = (prev.y / 100) * canvas.height;
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }
}

export const ProfilePage: React.FC = () => {
  const { user } = useUser();

  const extendedBadges = [
    ...user.badges,
    {
      id: 'b4', icon: badgeIcons.medal, name: '꾸준함의 증표',
      description: '7일 연속 활동 완료', acquiredDate: new Date().toISOString(), rare: false,
    },
    {
      id: 'b5', icon: badgeIcons.flame, name: '핫한 하루',
      description: '하루 최대 커밋 달성', acquiredDate: new Date().toISOString(), rare: false,
    },
    {
      id: 'b6', icon: badgeIcons.trophy, name: '랭킹 1위',
      description: '이번 주 별점 랭킹 1위 달성', acquiredDate: new Date().toISOString(), rare: true,
    },
  ];

  useEffect(() => {
    extendedBadges.forEach((badge) => {
      if (badge.rare) {
        const canvas = document.getElementById(`canvas-${badge.id}`) as HTMLCanvasElement;
        if (canvas) {
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
          drawStars(canvas);
        }
      }
    });
  }, []);

  const handleViewConstellation = (friendName: string, constellationIds: string[] = []) => {
    const templates = constellationTemplates.filter(t => constellationIds.includes(t.id));
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-gradient-to-br from-purple-900/90 to-indigo-900/90 z-50 flex items-center justify-center text-white p-6';

    overlay.innerHTML = `
      <div class='relative w-full max-w-3xl bg-purple-950/60 backdrop-blur-xl rounded-xl shadow-2xl p-8 border border-indigo-500'>
        <h2 class='text-2xl font-bold mb-6 text-center'>${friendName}님의 별자리</h2>
        <canvas id="constellation-canvas" class="w-full h-[500px] rounded-lg border border-white/10 bg-black/20"></canvas>
        <button class='absolute top-4 right-4 px-4 py-2 bg-white text-indigo-800 font-semibold rounded hover:bg-indigo-200'>닫기</button>
      </div>
    `;
    document.body.appendChild(overlay);

    const canvas = overlay.querySelector('#constellation-canvas') as HTMLCanvasElement;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // drawStars(canvas); // 별 그리기
      
      // 각 별자리 템플릿 반복
      templates.forEach(template => {
        drawConstellation(canvas, template); // 별자리 그리기
      });
    }

    overlay.querySelector('button')?.addEventListener('click', () => overlay.remove());
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-white bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold tracking-wide flex items-center gap-2">
          <Sparkles size={20} className="text-indigo-400" /> MY
        </h1>
      </header>

      <GlassCard className="mb-10 rounded-2xl bg-black/40 shadow-xl p-6 transition-all duration-300 hover:shadow-2xl hover:ring-1 hover:ring-indigo-500">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <img 
            src={user.profileImage}
            alt={user.name}
            className="w-24 h-24 rounded-full border-4 border-indigo-500 mx-auto sm:mx-0"
          />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold mb-2 text-white/90 break-words">{user.name}</h2>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm">
              <div className="flex items-center text-yellow-400">
                <Star size={16} className="mr-1" />
                {user.totalConstellations} 별자리
              </div>
              <div className="flex items-center text-green-400">
                <Award size={16} className="mr-1" />
                {user.accuracy}% 정확도
              </div>
              <div className="flex items-center text-purple-400">
                <Users size={16} className="mr-1" />
                {user.friends.length} 친구
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="text-white hover:text-indigo-300 transition-colors duration-200"
            icon={<Settings size={18} />}
          >
            설정
          </Button>
        </div>
      </GlassCard>

      <section className="mb-12">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Sparkles size={20} className="mr-2 text-indigo-400" /> 획득한 뱃지
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {extendedBadges.map((badge) => (
            <div 
              key={badge.id} 
              className={`relative flex flex-col items-center p-4 rounded-xl text-center transition-all duration-200 border border-white/10 hover:shadow-lg hover:-translate-y-1 ${badge.rare ? 'bg-indigo-500/20 ring-2 ring-indigo-400 backdrop-blur-md' : 'bg-gradient-to-b from-black/40 to-black/20'}`}
            >
              {badge.rare && (
                <canvas
                  id={`canvas-${badge.id}`}
                  className="absolute inset-0 w-full h-full rounded-xl z-0"
                />
              )}
              <div className="relative z-10 text-2xl mb-2">{badge.icon}</div>
              <div className="relative z-10 text-sm font-medium text-white/90 break-words">{badge.name}</div>
              <div className="relative z-10 text-xs text-gray-400 mt-1">{badge.description}</div>
              <div className="relative z-10 text-xs text-indigo-400 mt-2">
                {new Date(badge.acquiredDate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Users size={20} className="mr-2 text-purple-400" /> 친구 목록
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockFriends.map((friend) => {
            const allConstellations = friend.completedConstellations.map(c=>c.templateId)
            return (
            <div className="transition-transform hover:scale-[1.02]" key={friend.id}>
              <FriendProfile 
                friend={friend}
                onViewConstellations={() => handleViewConstellation(friend.name, allConstellations)}
              />
            </div>
          )})}
        </div>
      </section>
    </div>
  );
};
