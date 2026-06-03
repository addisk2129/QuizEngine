
import { useNavigate } from "react-router-dom";
import image from "./programming.png";
import Button from "../../../ui/Button";
import { FaFileAlt, FaUsers } from "react-icons/fa";

function QuizCard({ quizz }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/start-quiz/${quizz._id}`)}
      className="group bg-white rounded-2xl border border-gray-100 hover:border-secondary-400 shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="h-40 sm:h-44 bg-gray-100 overflow-hidden">
        <img
          src={image}
          alt={quizz?.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category badge */}
        {quizz?.categoryId?.name && (
          <span className="text-xs font-medium text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full w-fit mb-2">
            {quizz.categoryId.name}
          </span>
        )}

        {/* Title */}
        <h3 className="text-sm sm:text-base font-semibold text-secondary-700 leading-snug line-clamp-2">
          {quizz?.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed flex-1">
          {quizz?.description || "Test your knowledge with this quiz!"}
        </p>

        {/* Stats row */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
          <span className="flex items-center gap-1.5"><FaFileAlt /> {quizz?.totalQuestions} Questions</span>
          <span className="flex items-center gap-1.5"><FaUsers /> {quizz?.totalTakers || 0} Learners</span>
        </div>

        {/* CTA button — always visible on mobile, hover on desktop */}
        <Button
          $size="small"
          $variation="primary"
          className="w-full font-semibold mt-3 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300"
        >
          Take Quiz →
        </Button>
      </div>
    </div>
  );
}

export default QuizCard;

