import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Question from "./Question";
import QuizHeader from "./QuizHeader";
import QuizzSidebar from "./QuizzSidebar";

import { setQuizData, setCurrentQuestion } from '../QuizSlice';
import axiosPrivate from '../../../utils/axiosPrivate';

function QuizContainer() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentQuestionIndex } = useSelector((store) => store.quizz);

  const [loading, setLoading] = useState(true);
  const [quizData, setQuizDataState] = useState(null);

  const [showSidebar, setShowSidebar] = useState(false);

  const touchStartX = useRef(0);

  // ================= FETCH DATA =================
  useEffect(() => {
    fetchQuizData();
  }, [id]);

  const fetchQuizData = async () => {
    try {
      const [quizRes, questionsRes] = await Promise.all([
        axiosPrivate.get(`/quizzes/${id}`),
        axiosPrivate.get(`/questions/${id}`)
      ]);

      const data = {
        quizId: quizRes.data.data.quiz._id,
        quizTitle: quizRes.data.data.quiz.title,
        questions: questionsRes.data.data.questions
      };

      setQuizDataState(data);
      dispatch(setQuizData(data));
    } finally {
      setLoading(false);
    }
  };

  // ================= SWIPE GESTURE =================
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;

    // swipe right → open
    if (endX - touchStartX.current > 80) {
      setShowSidebar(true);
    }

    // swipe left → close
    if (touchStartX.current - endX > 80) {
      setShowSidebar(false);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="h-10 w-10 border-b-2 border-primary-600 animate-spin rounded-full" />
      </div>
    );
  }

  const total = quizData?.questions?.length || 0;
  const progress = ((currentQuestionIndex + 1) / total) * 100;

  return (
    <div
      className="h-screen flex flex-col bg-gray-50 relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >

      <QuizHeader toggleSidebar={() => setShowSidebar(true)} />

      

      <div className="flex flex-1 overflow-hidden">

        <div className="hidden md:block w-72 border-r bg-white">
          <QuizzSidebar
            questions={quizData?.questions}
            type="take"
            onSelect={() => setShowSidebar(false)}
          />
        </div>

        <div className="flex-1 w-full overflow-y-auto p-3 sm:p-5">
      <div className="h-3 bg-gray-400  rounded-2xl my-4 w-full">
        <div
          className="h-full bg-primary-600 rounded-2xl transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
          <Question questions={quizData?.questions} />
        </div>




        {/* MOBILE SIDEBAR */}
        {showSidebar && (
          <div className="fixed inset-0 z-50 flex">

            {/* sidebar */}
            <div className="w-64 h-full bg-white shadow-lg animate-slideIn">
              <QuizzSidebar
                questions={quizData?.questions}
                type="take"
                onSelect={() => setShowSidebar(false)} // AUTO CLOSE
              />
            </div>

            {/* overlay */}
            <div
              className="flex-1 bg-black/40"
              onClick={() => setShowSidebar(false)}
            />
          </div>
        )}

        {/* QUESTION AREA */}
        
      </div>

      {/* FLOATING BUTTON (mobile only) */}
      <button
        onClick={() => setShowSidebar(true)}
        className="
          md:hidden
          fixed bottom-2 left-5
          w-12 h-12
          rounded-full
          bg-primary-600
          text-white
          shadow-lg
          flex items-center justify-center
          text-xl
          active:scale-95 transition
        "
      >
        ☰
      </button>

    </div>
  );
}

export default QuizContainer;