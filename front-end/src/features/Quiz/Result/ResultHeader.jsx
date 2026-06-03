import { useSelector } from "react-redux";
import { Clock, ListChecks, Star, Menu } from "lucide-react";

function ResultHeader({ onToggleSidebar }) {
  const { questions, answers, timeTaken, score } = useSelector(
    (store) => store.quizz
  );

  const answeredCount = Object.keys(answers || {}).length;
  const totalQuestions = questions?.length || 0;

  const scorePercentage = totalQuestions
    ? Math.round((score / (totalQuestions * 10)) * 100)
    : 0;

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // 🧠 PERFORMANCE LOGIC (NEW)
  const getPerformance = () => {
    if (scorePercentage >= 80)
      return { text: "Excellent Performance", color: "text-green-300" };
    if (scorePercentage >= 50)
      return { text: "Good Performance", color: "text-yellow-300" };
    return { text: "Needs Improvement", color: "text-red-300" };
  };

  const performance = getPerformance();

  const stats = [
    { icon: Clock, value: formatTime(timeTaken || 0) },
    { icon: ListChecks, value: `${answeredCount}/${totalQuestions}` },
    { icon: Star, value: `${scorePercentage}%` },
  ];

  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-3 bg-secondary-700 text-white">

      {/* LEFT */}
      <div className="flex items-center gap-3">

        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg bg-white/10"
        >
          <Menu size={18} />
        </button>

        <div>
          <h1 className="text-sm sm:text-lg font-semibold">
            Quiz Results
          </h1>

          {/* NEW INSIGHT */}
          <p className={`text-[10px] sm:text-xs ${performance.color}`}>
            {performance.text}
          </p>
        </div>
      </div>

      {/* RIGHT STATS */}
      <div className="flex gap-2 sm:gap-3">

        {stats.map(({ icon: Icon, value }, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-2 sm:px-3 py-1.5 bg-white/10 rounded-lg text-[10px] sm:text-sm"
          >
            <Icon size={14} />
            <span>{value}</span>
          </div>
        ))}
      </div>
    </header>
  );
}

export default ResultHeader;