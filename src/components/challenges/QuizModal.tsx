import React, { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { GlassCard } from '../ui/GlassCard';

interface QuizQuestion {
  question: string;
  options: string[];
  answer: number; // 정답 인덱스
}

export const QuizModal: React.FC<{ onClose: () => void; onComplete: () => void }> = ({ onClose, onComplete }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/quiz/today")
      .then(res => res.json())
      .then(data => {
        setQuestions(data.questions);
        setUserAnswers(Array(data.questions.length).fill(-1));
      })
      .catch(err => {
        console.error("퀴즈 불러오기 실패:", err);
      });
  }, []);

  const handleAnswer = (choice: number) => {
    const updated = [...userAnswers];
    updated[currentIndex] = choice;
    setUserAnswers(updated);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSubmit = () => {
    const correct = questions.filter((q, i) => q.answer === userAnswers[i]).length;
    setResult(correct);
    if (correct >= 3) onComplete();
  };

  const restart = () => {
    setCurrentIndex(0);
    setUserAnswers(Array(questions.length).fill(-1));
    setResult(null);
  };

  const current = questions[currentIndex];

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <GlassCard className="max-w-xl w-full p-6 space-y-4">
        <h2 className="text-xl text-white font-bold">오늘의 퀴즈</h2>

        {questions.length === 0 ? (
          <p className="text-white">퀴즈를 불러오는 중...</p>
        ) : result === null ? (
          <>
            <p className="text-white mb-2">{currentIndex + 1}. {current.question}</p>
            <div className="space-y-1">
              {current.options.map((opt, i) => (
                <Button
                  key={i}
                  variant={userAnswers[currentIndex] === i ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleAnswer(i)}
                  className="w-full text-left"
                >
                  {opt}
                </Button>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <Button onClick={onClose} variant="outline">닫기</Button>
              {currentIndex === questions.length - 1 && (
                <Button onClick={handleSubmit}>제출</Button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="text-white pt-2">
              <p>정답 개수: {result} / {questions.length}</p>
              {result >= 3 ? <p>🎉 통과했습니다!</p> : <p>😢 다음에 다시 도전해요!</p>}
            </div>
            <div className="flex justify-end pt-4 space-x-2">
              <Button onClick={onClose} variant="outline">닫기</Button>
              <Button onClick={restart}>다시 풀기</Button>
            </div>
          </>
        )}
      </GlassCard>
    </div>
  );
};
