import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../ui/Button";
import {
  resetQuiz,
  setResultFilter,
  selectResultFilteredQuestions,
} from "../QuizSlice";

function ResultQuestionList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { questions, answers, resultFilter } = useSelector(
    (state) => state.quizz
  );

  const filteredQuestions = useSelector(selectResultFilteredQuestions);

  const total = questions?.length || 0;

  const correctCount =
    questions?.filter((q, i) => answers[i] === q.correctAnswer).length || 0;

  const incorrectCount =
    questions?.filter(
      (q, i) =>
        answers[i] !== undefined && answers[i] !== q.correctAnswer
    ).length || 0;

  const skippedCount =
    questions?.filter((_, i) => answers[i] === undefined).length || 0;

  const scorePercent = total
    ? Math.round((correctCount / total) * 100)
    : 0;

  // 🧠 PERFORMANCE STATUS
  const getStatus = () => {
    if (scorePercent >= 80)
      return { text: "Excellent Performance", color: "text-green-600" };
    if (scorePercent >= 50)
      return { text: "Good Performance", color: "text-yellow-600" };
    return { text: "Needs Improvement", color: "text-red-600" };
  };

  const status = getStatus();

  return (
    <div className="space-y-4">

      {/* 📊 PERFORMANCE SUMMARY (EXAM STYLE) */}
      <div className="bg-white border rounded-lg p-4 sm:p-5 space-y-4">

        {/* TITLE */}
        <h2 className="text-sm sm:text-base font-semibold text-gray-800">
          Performance Summary
        </h2>

        {/* 🏆 BIG SCORE (IMPORTANT FOCUS) */}
        <div className="text-center py-2">
          <p className="text-xs text-gray-500">Your Score</p>

          <p className="text-3xl sm:text-4xl font-bold text-blue-600">
            {correctCount * 10} / {total * 10}
          </p>

          <p className="text-sm text-gray-600 mt-1">
            Accuracy: <strong>{scorePercent}%</strong>
          </p>

          <p className={`text-xs sm:text-sm font-medium mt-1 ${status.color}`}>
            {status.text}
          </p>
        </div>

        {/* SUMMARY TEXT */}
        <p className="text-xs text-gray-500 text-center">
          You answered <strong>{correctCount}</strong> out of{" "}
          <strong>{total}</strong> questions correctly.
        </p>

        {/* STATS GRID */}
        <div className="grid grid-cols-3 gap-2 text-center">

          <div className="bg-green-50 p-2 rounded">
            <p className="text-green-600 font-semibold text-sm">
              {correctCount}
            </p>
            <p className="text-[10px] text-gray-500">Correct</p>
          </div>

          <div className="bg-red-50 p-2 rounded">
            <p className="text-red-600 font-semibold text-sm">
              {incorrectCount}
            </p>
            <p className="text-[10px] text-gray-500">Incorrect</p>
          </div>

          <div className="bg-gray-50 p-2 rounded">
            <p className="text-gray-700 font-semibold text-sm">
              {skippedCount}
            </p>
            <p className="text-[10px] text-gray-500">Skipped</p>
          </div>

        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap justify-end gap-2 sticky top-0 bg-gray-50 py-2 z-10">
        {[
          ["all", total],
          ["correct", correctCount],
          ["incorrect", incorrectCount],
          ["skipped", skippedCount],
        ].map(([type, count]) => (
          <button
            key={type}
            onClick={() => dispatch(setResultFilter(type))}
            className={`px-3 py-1 text-[11px] sm:text-sm rounded-full border ${
              resultFilter === type
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-300"
            }`}
          >
            {type} ({count})
          </button>
        ))}
      </div>

      {/* QUESTIONS */}
      {filteredQuestions.map((q) => {
        const index = q.originalIndex;
        const selected = answers[index];

        const isCorrect = selected === q.correctAnswer;

        return (
          <div
            key={index}
            className="p-3 sm:p-4 border rounded-lg bg-white space-y-2"
          >
            <p className="text-xs sm:text-sm text-gray-800">
              <span className="font-medium">Q{index + 1}.</span> {q.text}
            </p>

            <div className="space-y-1">
              {q.options.map((opt, i) => (
                <div
                  key={i}
                  className={`text-xs sm:text-sm px-2 py-1 rounded ${
                    q.correctAnswer === i
                      ? "bg-green-100 text-green-700"
                      : selected === i && !isCorrect
                      ? "bg-red-100 text-red-600"
                      : ""
                  }`}
                >
                  {opt}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* FOOTER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 pt-4">
        <Button className='px-25' onClick={() => dispatch(resetQuiz())}>
          Try Again
        </Button>

        <Button  className='px-30' onClick={() => navigate("/")}>
          Home
        </Button>
      </div>
    </div>
  );
}

export default ResultQuestionList;