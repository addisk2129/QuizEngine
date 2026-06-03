import { useSelector } from "react-redux";
import Timer from "./Timer";
import Logo from "../../../ui/Logo";

function QuizHeader({ onToggleSidebar }) {
  const { totalQuestions, currentQuestionIndex, quizTitle } =
    useSelector((store) => store.quizz);

  return (
    <header className="bg-secondary-700 text-white sm:px-7 px-2  py-3 flex items-center justify-between shadow-md">

      {/* LEFT */}
      

        <Logo />
      

      {/* CENTER (EXAM INFO) */}
      <div className="flex flex-col 4 items-center text-center leading-tight">

        <h1 className="text-sm sm:text-base font-semibold truncate max-w-[140px] sm:max-w-none">
          {quizTitle}
        </h1>

        <div className="flex items-center gap-2 text-xs text-gray-200 mt-0.5">

          {/* question progress badge */}
          <span className="bg-white/10 px-2 py-0.5 rounded-md">
            {currentQuestionIndex + 1}/{totalQuestions}
          </span>

        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3 sm:gap-5 text-sm">

        {/* TIMER (always visible, important for exams) */}
        <div className="bg-white/10 px-3 py-1 rounded-md text-xs sm:text-sm font-medium">
          <Timer />
        </div>

        {/* USER */}
        <span className="hidden sm:block text-xs sm:text-sm opacity-90">
          Addisu
        </span>

      </div>
    </header>
  );
}

export default QuizHeader;