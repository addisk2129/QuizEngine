
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import QuizCard from "./QuizCard";
import axiosPublic from "../../../utils/axiosPublic";
import { FaRegFolderOpen } from "react-icons/fa";

function QuizList() {
  const { category } = useSelector((store) => store.quizz);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axiosPublic.get("/quizzes");
      setQuizzes(response.data.data.quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuizzes =
    category === "all"
      ? quizzes
      : quizzes.filter(
          (quiz) =>
            quiz.categoryId?._id === category || quiz.categoryId === category
        );

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 mt-4 pb-6">
      {filteredQuizzes.length === 0 ? (
        <div className="col-span-full text-center py-16 text-gray-400">
          <div className="flex justify-center text-5xl mb-4 text-gray-300">
            <FaRegFolderOpen />
          </div>
          <p className="text-base font-medium">No quizzes found in this category.</p>
        </div>
      ) : (
        filteredQuizzes.map((quiz) => <QuizCard key={quiz._id} quizz={quiz} />)
      )}
    </div>
  );
}

export default QuizList;