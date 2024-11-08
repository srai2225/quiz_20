interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
}

export default function QuizProgress({
  currentQuestion,
  totalQuestions,
}: QuizProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {[...Array(totalQuestions)].map((_, index) => (
          <div key={index} className="flex items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0
                ${
                  index + 1 === currentQuestion
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
            >
              {index + 1}
            </div>
            {index < totalQuestions - 1 && (
              <div className="h-1 w-full bg-gray-200" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
