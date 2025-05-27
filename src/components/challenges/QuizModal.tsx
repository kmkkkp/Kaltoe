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
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    const fetchQuiz = async () => {
        try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                role: "user",
                content: `
    너는 주식 퀴즈 출제자야. 오늘의 객관식 퀴즈 5문제를 아래 형식으로 생성해줘.
    각 문제는 "question", "options"(4개), "answer"(정답 인덱스, 0부터 시작)로 구성된 JSON 배열이야.
    [
    {
        "question": "2023년 기준 코스피 시가총액 1위 기업은?",
        "options": ["삼성전자", "LG에너지솔루션", "카카오", "현대차"],
        "answer": 0
    },
    ...
    ]
    `,
                },
            ],
            }),
        });

        const data = await res.json();
        const parsed = JSON.parse(data.choices[0].message.content);
        setQuestions(parsed);
        setUserAnswers(Array(parsed.length).fill(-1));
        } catch (err) {
        console.error("GPT 호출 실패:", err);
        }
    };

    fetchQuiz();
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
