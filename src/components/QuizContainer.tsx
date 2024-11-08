"use client";

import { useState, useEffect } from "react";
import QuizProgress from "./QuizProgress";
import QuizHeader from "./QuizHeader";
import quizData from "@/data/quiz.json";
import QuizReport from "./QuizReport";

interface Answer {
  questionId: number;
  selectedOption: string;
}

export default function QuizContainer() {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeLeft, setTimeLeft] = useState(quizData.timeLimit);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsFinished(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleOptionSelect = (questionId: number, optionId: string) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === questionId);
      if (existing) {
        return prev.map((a) =>
          a.questionId === questionId ? { ...a, selectedOption: optionId } : a
        );
      }
      return [...prev, { questionId, selectedOption: optionId }];
    });
  };

  const currentQuestionData = quizData.questions.find(
    (q) => q.id === currentQuestion
  );

  const handleNext = () => {
    if (currentQuestion < quizData.questions.length) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const selectedAnswer = answers.find(
    (a) => a.questionId === currentQuestion
  )?.selectedOption;

  const handleFinish = () => {
    const correctCount = answers.reduce((acc, answer) => {
      const question = quizData.questions.find(
        (q) => q.id === answer.questionId
      );
      return question?.correctAnswer === answer.selectedOption ? acc + 1 : acc;
    }, 0);

    setCorrectAnswers(correctCount);
    setIncorrectAnswers(quizData.questions.length - correctCount);
    setScore((correctCount / quizData.questions.length) * 100);
    setIsFinished(true);
    localStorage.setItem("quizAnswers", JSON.stringify(answers));
  };

  if (isFinished) {
    return (
      <main className="min-h-screen bg-gray-50 py-8 text-black">
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-8 text-center">
            Quiz by Quiz20
          </h1>
          <h2 className="text-xl font-semibold mb-12 text-center">Quiz20</h2>
          <QuizReport />
        </div>
      </main>
    );
  }
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <QuizHeader timeLeft={formatTime(timeLeft)} />

      <QuizProgress
        currentQuestion={currentQuestion}
        totalQuestions={quizData.questions.length}
      />

      {currentQuestionData && !isFinished && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {currentQuestionData.text}
          </h2>
          <div className="space-y-3">
            {currentQuestionData.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(currentQuestion, option.id)}
                className={`w-full p-4 text-left rounded-lg border transition-colors ${
                  selectedAnswer === option.id
                    ? "bg-blue-500 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 1}
          className="px-6 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>
        {currentQuestion === quizData.questions.length ? (
          <button
            onClick={handleFinish}
            className="px-6 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Finish Quiz
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className="px-6 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
