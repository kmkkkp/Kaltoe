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
  const [result, setResult] = useState<number | null>(null);

//   
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

  const handleAnswer = (index: number, choice: number) => {
    const updated = [...userAnswers];
    updated[index] = choice;
    setUserAnswers(updated);
  };

  const handleSubmit = () => {
    const correct = questions.filter((q, i) => q.answer === userAnswers[i]).length;
    setResult(correct);
    if (correct >= 3) onComplete(); // 3개 이상 맞추면 통과
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <GlassCard className="max-w-xl w-full p-6 space-y-4">
        <h2 className="text-xl text-white font-bold">오늘의 퀴즈</h2>
        {questions.length === 0 ? (
          <p className="text-white">퀴즈를 불러오는 중...</p>
        ) : (
          questions.map((q, i) => (
            <div key={i}>
              <p className="text-white mb-2">{i + 1}. {q.question}</p>
              <div className="space-y-1">
                {q.options.map((opt, j) => (
                  <Button
                    key={j}
                    variant={userAnswers[i] === j ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleAnswer(i, j)}
                    className="w-full text-left"
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            </div>
          ))
        )}
        {result !== null && (
          <div className="text-white pt-2">
            <p>정답 개수: {result} / {questions.length}</p>
            {result >= 3 ? <p>🎉 통과했습니다!</p> : <p>😢 다음에 다시 도전해요!</p>}
          </div>
        )}
        <div className="flex justify-end space-x-2 pt-4">
          <Button onClick={onClose} variant="outline">닫기</Button>
          {result === null && <Button onClick={handleSubmit}>제출</Button>}
        </div>
      </GlassCard>
    </div>
  );
};
