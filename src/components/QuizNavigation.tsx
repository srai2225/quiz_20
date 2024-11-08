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
      <div className="flex items-center justify-between max-w-md">
        {[...Array(totalQuestions)].map((_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center
                ${
                  index + 1 === currentQuestion
                    ? "bg-blue-500 "
                    : "bg-gray-200 "
                }`}
            >
              {index + 1}
            </div>
            {index < totalQuestions - 1 && (
              <div className="h-[2px] w-12 bg-gray-200"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
