interface QuizHeaderProps {
  timeLeft: string;
}

export default function QuizHeader({ timeLeft }: QuizHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold text-gray-800">Quiz20</h1>
      <div className="text-xl font-mono bg-gray-100 text-gray-800 px-4 py-2 rounded-full">
        {timeLeft}
      </div>
    </div>
  );
}
