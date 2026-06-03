import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setQuizData, startTimer, setTimeRemaining } from "./QuizSlice";
import Button from "../../ui/Button";
import axiosPrivate from "../../utils/axiosPrivate";

function StartPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState({
    showTimer: true,
    autoSave: true,
  });

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axiosPrivate.get(`/quizzes/${id}`);
        setQuiz(res.data.data.quiz);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const totalTime = quiz?.duration || quiz?.totalQuestions * 30 || 0;

  const handleStartQuiz = async () => {
    try {
      const res = await axiosPrivate.get(`/questions/${id}`);

      dispatch(
        setQuizData({
          quizId: quiz._id,
          quizTitle: quiz.title,
          questions: res.data.data.questions,
        })
      );

      dispatch(setTimeRemaining(totalTime * 60));
      dispatch(startTimer());

      navigate(`/quiz/${quiz._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-800">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" />
      </div>
    );
  }

  /* ================= NOT FOUND ================= */
  if (!quiz) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-secondary-800 text-white gap-4">
        <h2 className="text-xl font-semibold">Quiz not found</h2>
        <button
          onClick={() => navigate("/")}
          className="bg-primary-600 px-5 py-2 rounded-lg hover:bg-primary-700 transition"
        >
          Go Home
        </button>
      </div>
    );
  }

  /* ================= DATA ================= */
  const stats = [
    { label: "Time", value: `${quiz.duration} min` },
    { label: "Questions", value: quiz.totalQuestions },
    { label: "Points", value: quiz.totalPoints },
  ];

  const instructions = [
    "Read each question carefully",
    "Each question has 4 options",
    "No negative marking",
    "Skip and return later",
  ];

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-800 px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-primary-600 text-white text-center px-6 py-6">
          <h1 className="text-xl sm:text-2xl font-bold">{quiz.title}</h1>
          {quiz.description && (
            <p className="text-sm mt-2 text-white/80">{quiz.description}</p>
          )}
        </div>

        {/* BODY */}
        <div className="p-5 sm:p-6 space-y-6">

          {/* STATS */}
          <div className="grid grid-cols-3 gap-3 text-center">
            {stats.map((item) => (
              <div key={item.label} className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="font-semibold text-secondary-700">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* INSTRUCTIONS */}
          <div>
            <h3 className="font-semibold text-secondary-700 mb-2">
              Instructions
            </h3>
            <ul className="space-y-1 text-sm text-gray-600">
              {instructions.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-primary-600">•</span> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* SETTINGS */}
          <div>
            <h3 className="font-semibold text-secondary-700 mb-2">
              Settings
            </h3>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.showTimer}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      showTimer: e.target.checked,
                    })
                  }
                />
                Show timer
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      autoSave: e.target.checked,
                    })
                  }
                />
                Auto-save
              </label>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              $variation="secondary"
              className="w-full"
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>

            <Button
              $variation="primary"
              className="w-full"
              onClick={handleStartQuiz}
            >
              Start Quiz
            </Button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center text-xs text-gray-500 py-3 border-t">
          Timer starts immediately after clicking start
        </div>
      </div>
    </div>
  );
}

export default StartPage;