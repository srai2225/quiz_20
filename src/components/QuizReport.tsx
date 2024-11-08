import { useEffect, useState } from "react";
import quizData from "@/data/quiz.json";

interface Answer {
  questionId: number;
  selectedOption: string;
}

interface QuizStats {
  correct: number;
  incorrect: number;
  notAttempted: number;
  score: number;
}

export default function QuizReport() {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [stats, setStats] = useState<QuizStats>({
    correct: 0,
    incorrect: 0,
    notAttempted: 0,
    score: 0,
  });

  useEffect(() => {
    const savedAnswers = localStorage.getItem("quizAnswers");
    if (savedAnswers) {
      const parsedAnswers = JSON.parse(savedAnswers);
      setAnswers(parsedAnswers);

      // Calculate statistics
      const totalQuestions = quizData.questions.length;
      const attempted = parsedAnswers.length;
      const correct = parsedAnswers.reduce((acc: number, answer: Answer) => {
        const question = quizData.questions.find(
          (q) => q.id === answer.questionId
        );
        return question?.correctAnswer === answer.selectedOption
          ? acc + 1
          : acc;
      }, 0);

      setStats({
        correct,
        incorrect: attempted - correct,
        notAttempted: totalQuestions - attempted,
        score: (correct / totalQuestions) * 100,
      });
    }
  }, []);

  // Calculate segment angles for the circle
  const totalQuestions = quizData.questions.length;
  const segmentAngle = 360 / totalQuestions;
  const correctSegments = Array(stats.correct).fill("correct");
  const incorrectSegments = Array(stats.incorrect).fill("incorrect");
  const notAttemptedSegments = Array(stats.notAttempted).fill("notAttempted");
  const allSegments = [
    ...correctSegments,
    ...incorrectSegments,
    ...notAttemptedSegments,
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="relative w-64 h-64 mx-auto">
        {/* Circular Progress with Segments */}
        <svg className="w-full h-full transform -rotate-90">
          {allSegments.map((type, index) => {
            const startAngle = index * segmentAngle;
            const endAngle = startAngle + segmentAngle;
            const start = polarToCartesian(128, 128, 120, startAngle);
            const end = polarToCartesian(128, 128, 120, endAngle);
            const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

            return (
              <path
                key={index}
                d={`M ${start.x} ${start.y} A 120 120 0 ${largeArcFlag} 1 ${end.x} ${end.y}`}
                fill="none"
                strokeWidth="20"
                className={`${
                  type === "correct"
                    ? "stroke-green-500"
                    : type === "incorrect"
                    ? "stroke-red-500"
                    : "stroke-gray-200"
                }`}
              />
            );
          })}
        </svg>
        {/* Score Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold">
            Score: {stats.score.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="flex justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Correct ({stats.correct})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Incorrect ({stats.incorrect})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          <span>Not Attempted ({stats.notAttempted})</span>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="text-lg font-semibold">Positive</div>
          <div className="text-2xl font-bold text-green-500">
            {(stats.correct * 1).toFixed(2)}
          </div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="text-lg font-semibold">Negative</div>
          <div className="text-2xl font-bold text-red-500">
            {stats.incorrect.toFixed(2)}
          </div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="text-lg font-semibold">Total</div>
          <div className="text-2xl font-bold">
            {(stats.correct - stats.incorrect * 0.25).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button className="p-4 bg-gray-800 text-white rounded-lg flex items-center justify-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          Share
        </button>
        <button className="p-4 bg-gray-800 text-white rounded-lg flex items-center justify-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          Answers
        </button>
      </div>
    </div>
  );
}

// Helper function to convert polar coordinates to cartesian
function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}
