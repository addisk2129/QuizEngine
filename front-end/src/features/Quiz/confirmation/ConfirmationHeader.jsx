import { useSelector } from "react-redux";
import { Menu, Clock, ListChecks, Star } from "lucide-react";

function ConfirmationHeader({ onToggleSidebar }) {
  const { questions, answers ,timeTaken} = useSelector((store) => store.quizz);

  const totalQuestions = questions?.length || 0;

  // ✅ REAL CORRECT ANSWER CALCULATION
  const correctCount =
    questions?.filter((q, i) => answers[i] === q.correctAnswer).length || 0;

  const answeredCount = Object.keys(answers || {}).length;

  const incorrectCount =
    questions?.filter(
      (q, i) =>
        answers[i] !== undefined && answers[i] !== q.correctAnswer
    ).length || 0;
    const formatTime = (seconds) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s.toString().padStart(2, "0")}`;
    };

  const skippedCount = totalQuestions - answeredCount;


  const scorePercentage = totalQuestions
    ? Math.round((correctCount / totalQuestions) * 100)
    : 0;

  const stats = [
    {
      icon: ListChecks,
      value: `${answeredCount}/${totalQuestions}`,
      label: "Answered",
    },
    {
      icon: Star,
      value: `${scorePercentage}%`,
      label: "Accuracy",
    },
  ];

  return (
    <header className="w-full flex items-center justify-between px-4 md:px-8 py-3 bg-secondary-700 text-white">

      {/* LEFT */}
      <div className="flex items-center gap-3">

        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
        >
          <Menu size={18} />
        </button>

        <div className="leading-tight">
          <h1 className="text-sm sm:text-lg font-semibold">
            Review Answers
          </h1>
          <p className="text-[10px] sm:text-xs text-white/70">
            Check before submitting
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* TIMER */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-xs sm:text-sm">
          <Clock size={14} />
          <span>{formatTime(timeTaken || 0)}</span>
       </div>

        {/* STATS */}
        {stats.map(({ icon: Icon, value, label }, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-white/10 text-[10px] sm:text-sm"
          >
            <Icon size={14} />
            <div className="text-center sm:text-left leading-tight">
              <p className="font-medium">{value}</p>
              <p className="text-[9px] sm:text-xs text-white/70">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </header>
  );
}

export default ConfirmationHeader;