import React, { useState } from 'react';
import { Challenge } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { BookOpen, BarChart, PenTool } from 'lucide-react';
import { ChallengeModal } from './ChallengeModal';

interface ChallengeCardProps {
  type: Challenge;
  isCompleted: boolean;
  onStart: () => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ 
  type, 
  isCompleted, 
  onStart 
}) => {
  const [showModal, setShowModal] = useState(false);

  const getChallengeInfo = (type: Challenge) => {
    switch (type) {
      case 'quiz':
        return {
          title: '오늘의 퀴즈',
          description: '주식 지식을 테스트하는 5개의 질문에 답하세요.',
          icon: <BookOpen className="text-blue-400" />,
          color: 'bg-blue-500/20 border-blue-500/30',
          textColor: 'text-blue-300',
        };
      case 'writing':
        return {
          title: '투자 글쓰기',
          description: '오늘의 투자 전략이나 관심 종목에 대해 글을 작성하세요.',
          icon: <PenTool className="text-green-400" />,
          color: 'bg-green-500/20 border-green-500/30',
          textColor: 'text-green-300',
        };
      case 'prediction':
        return {
          title: '수익률 예측',
          description: '관심 종목의 내일 종가 수익률을 예측해보세요.',
          icon: <BarChart className="text-purple-400" />,
          color: 'bg-purple-500/20 border-purple-500/30',
          textColor: 'text-purple-300',
        };
    }
  };

  const info = getChallengeInfo(type);

  const handleComplete = () => {
    setShowModal(false);
    onStart();
  };

  return (
    <>
      <GlassCard className={`${info.color} transition-transform duration-300 hover:scale-[1.01]`}>
        <div className="flex items-start">
          <div className="p-2 rounded-lg bg-black/30 mr-4">
            {info.icon}
          </div>
          <div className="flex-1">
            <h3 className={`font-semibold ${info.textColor}`}>{info.title}</h3>
            <p className="text-gray-300 text-sm mt-1">{info.description}</p>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button
            variant={isCompleted ? 'outline' : 'primary'}
            size="sm"
            onClick={() => !isCompleted && setShowModal(true)}
            disabled={isCompleted}
          >
            {isCompleted ? '완료됨' : '시작하기'}
          </Button>
        </div>
      </GlassCard>

      {showModal && (
        <ChallengeModal
          type={type}
          onClose={() => setShowModal(false)}
          onComplete={handleComplete}
        />
      )}
    </>
  );
};