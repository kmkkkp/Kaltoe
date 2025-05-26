import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { Challenge } from '../../types';
import { X } from 'lucide-react';

interface ChallengeModalProps {
  type: Challenge;
  onClose: () => void;
  onComplete: () => void;
}

export const ChallengeModal: React.FC<ChallengeModalProps> = ({
  type,
  onClose,
  onComplete,
}) => {
  const [content, setContent] = useState('');
  const [prediction, setPrediction] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  // Mock quiz questions
  const questions = [
    {
      question: '주식시장에서 "황소장"은 무엇을 의미하나요?',
      options: ['하락장', '상승장', '횡보장', '변동성 장'],
      correctAnswer: 1
    },
    {
      question: '다음 중 시가총액이란?',
      options: [
        '주식의 액면가 × 발행주식수',
        '주가 × 발행주식수',
        '순이익 × 주가',
        '자본금 × 주가'
      ],
      correctAnswer: 1
    },
    {
      question: 'PER(주가수익비율)이 높다는 것은 무엇을 의미하나요?',
      options: [
        '기업의 수익성이 높다',
        '주가가 저평가되어 있다',
        '주가가 고평가되어 있다',
        '기업의 부채가 많다'
      ],
      correctAnswer: 2
    },
    {
      question: '배당수익률은 어떻게 계산하나요?',
      options: [
        '(주당배당금 ÷ 주가) × 100',
        '(순이익 ÷ 자본금) × 100',
        '(영업이익 ÷ 매출액) × 100',
        '(당기순이익 ÷ 총자산) × 100'
      ],
      correctAnswer: 0
    },
    {
      question: '다음 중 defensice stock(방어주)로 알려진 업종은?',
      options: [
        'IT 기업',
        '제약/의료',
        '엔터테인먼트',
        '반도체'
      ],
      correctAnswer: 1
    }
  ];

  const handleQuizAnswer = (selectedAnswer: number) => {
    const isCorrect = selectedAnswer === questions[currentQuestionIndex].correctAnswer;
    setAnswers([...answers, isCorrect]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz completed
      const correctAnswers = answers.filter(a => a).length + (isCorrect ? 1 : 0);
      if (correctAnswers >= 4) {
        onComplete();
      } else {
        alert('4문제 이상 맞춰야 합니다. 다시 도전해보세요!');
        onClose();
      }
    }
  };

  const handleWritingSubmit = () => {
    if (content.length < 100) {
      alert('최소 100자 이상 작성해주세요.');
      return;
    }
    onComplete();
  };

  const handlePredictionSubmit = () => {
    if (prediction === null) {
      alert('수익률을 입력해주세요.');
      return;
    }
    onComplete();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <GlassCard className="w-full max-w-lg max-h-[80vh] overflow-y-auto relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2"
          onClick={onClose}
          icon={<X size={16} />}
        />

        {type === 'quiz' && (
          <div>
            <h3 className="text-xl font-bold text-white mb-6">
              퀴즈 {currentQuestionIndex + 1}/{questions.length}
            </h3>
            <p className="text-white mb-4">{questions[currentQuestionIndex].question}</p>
            <div className="space-y-2">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <button
                  key={index}
                  className="w-full p-3 text-left rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
                  onClick={() => handleQuizAnswer(index)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {type === 'writing' && (
          <div>
            <h3 className="text-xl font-bold text-white mb-4">투자 글쓰기</h3>
            <textarea
              className="w-full h-40 p-3 rounded-lg bg-white/10 text-white resize-none"
              placeholder="오늘의 투자 전략이나 관심 종목에 대해 작성해주세요. (최소 100자)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="text-right mt-2 text-gray-400">
              {content.length}/100자
            </div>
            <Button
              variant="primary"
              className="w-full mt-4"
              onClick={handleWritingSubmit}
            >
              제출하기
            </Button>
          </div>
        )}

        {type === 'prediction' && (
          <div>
            <h3 className="text-xl font-bold text-white mb-4">수익률 예측</h3>
            <p className="text-gray-300 mb-4">
              내일의 KOSPI 종가 수익률을 예측해주세요.
              결과는 다음 날 장 마감 후 확인됩니다.
            </p>
          <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setPrediction(1)}
            className={`aspect-square rounded-2xl flex flex-col justify-center items-center border transition-all duration-300 ${
              prediction === 1
                ? 'bg-red-500/30 border-red-400 text-red-100 shadow-lg'
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            }`}
          >
            <span className="text-3xl">📈</span>
            <span className="mt-2 text-sm font-semibold">오를 것 같아요</span>
          </button>

          <button
            onClick={() => setPrediction(-1)}
            className={`aspect-square rounded-2xl flex flex-col justify-center items-center border transition-all duration-300 ${
              prediction === -1
                ? 'bg-blue-500/30 border-blue-400 text-blue-100 shadow-lg'
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            }`}
          >
            <span className="text-3xl">📉</span>
            <span className="mt-2 text-sm font-semibold">내릴 것 같아요</span>
          </button>
        </div>

        <Button
          variant="primary"
          className="w-full mt-6"
          onClick={handlePredictionSubmit}
        >
          예측 제출
        </Button>
          </div>
        )}
      </GlassCard>
    </div>
  );
};