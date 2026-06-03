import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import ResultHeader from "./ResultHeader";
import ResultQuestionList from "./ResultQuestionList";
import QuizzSidebar from "../TakeQuiz/QuizzSidebar";
import { setQuizData } from "../QuizSlice";
import axiosPrivate from "../../../utils/axiosPrivate";

function Result() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quizData, setQuizDataState] = useState(null);

  useEffect(() => {
    fetchQuizData();
  }, [id]);

  const fetchQuizData = async () => {
    try {
      const [quizRes, questionRes] = await Promise.all([
        axiosPrivate.get(`/quizzes/${id}`),
        axiosPrivate.get(`/questions/${id}`),
      ]);

      const data = {
        quizId: quizRes.data.data.quiz._id,
        quizTitle: quizRes.data.data.quiz.title,
        questions: questionRes.data.data.questions || [],
      };

      setQuizDataState(data);
      dispatch(setQuizData(data));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">

      {/* HEADER */}
      <ResultHeader onToggleSidebar={() => setSidebarOpen(true)} />

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:block w-64 border-r bg-white overflow-y-auto">
          <QuizzSidebar questions={quizData} type="result" />
        </aside>

        {/* MOBILE SIDEBAR (OVERLAY) */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">

            {/* BACKDROP */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setSidebarOpen(false)}
            />

            {/* PANEL */}
            <div className="relative w-72 max-w-[80%] h-full bg-white shadow-xl overflow-y-auto">
              <QuizzSidebar
                questions={quizData}
                type="result"
              />
            </div>
          </div>
        )}

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          <ResultQuestionList />
        </main>
      </div>
    </div>
  );
}

export default Result;