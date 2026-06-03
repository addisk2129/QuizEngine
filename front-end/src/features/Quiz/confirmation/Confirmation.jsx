import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import ConfirmationHeader from "./ConfirmationHeader";
import ConfirmationQuestion from "./ConfirmationQuestion";
import SidebarContent from "../SidebarContent";
import { setQuizData } from "../QuizSlice";
import axiosPrivate from "../../../utils/axiosPrivate";

function Confirmation() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchQuizData();
  }, [id]);

  const fetchQuizData = async () => {
    try {
      const [questionsResponse, quizResponse] = await Promise.all([
        axiosPrivate.get(`/questions/${id}`),
        axiosPrivate.get(`/quizzes/${id}`),
      ]);

      const quizData = {
        quizId: quizResponse.data.data.quiz._id,
        quizTitle: quizResponse.data.data.quiz.title,
        questions: questionsResponse.data.data.questions || [],
      };

      dispatch(setQuizData(quizData));
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">

      {/* HEADER */}
      <ConfirmationHeader
        onToggleSidebar={() => setSidebarOpen(true)}
      />

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:block w-64 border-r bg-white overflow-y-auto">
          <SidebarContent type="confirmation" />
        </aside>

        {/* MOBILE SIDEBAR (OVERLAY) */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">

            {/* BACKDROP */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setSidebarOpen(false)}
            />

            {/* SIDEBAR PANEL */}
            <div className="relative w-72 max-w-[80%] bg-white h-full shadow-xl overflow-y-auto">
              <SidebarContent type="confirmation" />
            </div>
          </div>
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          <ConfirmationQuestion />
        </main>
      </div>
    </div>
  );
}

export default Confirmation;