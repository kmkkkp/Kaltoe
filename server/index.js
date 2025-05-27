const express = require("express");
const cors = require("cors");
const OpenAI = require("openai"); // 최신 방식
require("dotenv").config();

const app = express();
const port = 3000;

app.use(cors());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const quizCache = {};

// app.get("/api/quiz/today", (req, res) => {
//   res.json({ message: "테스트 응답입니다" });
// });

app.get("/api/quiz/today", async (req, res) => {
  console.log("📥 /api/quiz/today 요청 도착");

  const today = new Date().toISOString().slice(0, 10);

  if (quizCache[today]) {
    return res.json({ questions: quizCache[today] });
  }

  const prompt = `
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
`;

  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
    });

    const content = chatCompletion.choices[0].message.content;
    const questions = JSON.parse(content);
    quizCache[today] = questions;

    res.json({ questions });
  } catch (err) {
    console.error("❌ GPT 요청 실패!");
    console.error("Status:", err.status || err.response?.status);

    if (err.response) {
      console.error("🔴 GPT 응답 내용:", JSON.stringify(err.response.data, null, 2));
    } else {
      console.error("Error 객체:", err);
    }

    res.status(500).json({ error: "퀴즈 생성 실패" });
  }
});

app.listen(port, () => {
  console.log(`Quiz server listening at http://localhost:${port}`);
});

// GPT 키 연결 테스트
openai.models.list()
  .then(response => {
    console.log("✅ GPT API 연결 성공!");
    console.log("사용 가능한 모델 수:", response.data.length);
  })
  .catch(error => {
    console.error("❌ GPT API 연결 실패!");
    console.error("Status:", error.status);
    if (error.response) {
      console.error("Response Data:", error.response.data);
    } else {
      console.error(error);
    }
  });
