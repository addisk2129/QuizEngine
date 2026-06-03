import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container, Content, Footer, Header } from "../QuestionComponent";
import Button from "../../../ui/Button";
import {
  completeQuiz,
  setFilter,
  selectFilteredQuestions,
} from "../QuizSlice";
import axiosPrivate from "../../../utils/axiosPrivate";

const filters = [
  { key: "all", label: "All" },
  { key: "answered", label: "Answered" },
  { key: "unanswered", label: "Unanswered" },
];

function ConfirmationQuestion() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    quizId,
    questions,
    answeredQuestions,
    filter,
    answers,
    startTime,
  } = useSelector((state) => state.quizz);

  const filteredQuestions = useSelector(selectFilteredQuestions);

  const total = questions?.length || 0;
  const answered = answeredQuestions?.length || 0;
  const unanswered = total - answered;

  const getCount = (key) => {
    if (key === "all") return total;
    if (key === "answered") return answered;
    return unanswered;
  };

  const handleSubmit = async () => {
    try {
      const { data } = await axiosPrivate.post("/attempts", { quizId });
      const attemptId = data.data.attempt._id;

      const formattedAnswers = Object.entries(answers)
        .map(([index, selectedOption]) => ({
          questionId: questions[parseInt(index)]?._id,
          selectedOption,
        }))
        .filter((a) => a.questionId);

      const timeTaken = startTime
        ? Math.floor((Date.now() - startTime) / 1000)
        : 0;

      await axiosPrivate.patch(`/attempts/${attemptId}/submit`, {
        answers: formattedAnswers,
        timeTaken,
      });

      dispatch(completeQuiz());
      navigate(`/result/${quizId}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (!questions || total === 0) {
    return (
      <Container>
        <div className="flex items-center justify-center h-96">
          <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* HEADER */}
      <Header>
        <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(answered / total) * 100}%` }}
          />
        </div>
      </Header>

      {/* CONTENT */}
      <Content>
        {/* FILTERS */}
        <div className="sticky top-0 z-10 bg-white py-2 sm:py-3 flex flex-wrap gap-2 justify-end">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => dispatch(setFilter(f.key))}
              className={`px-3 py-1 text-[11px] sm:text-sm rounded-full border transition
                ${
                  filter === f.key
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                }`}
            >
              {f.label} ({getCount(f.key)})
            </button>
          ))}
        </div>

        {/* QUESTIONS LIST */}
        <div className="space-y-2 mt-3 sm:mt-4">
          {filteredQuestions.map((q) => {
            const index = q.originalIndex;
            const isAnswered = answeredQuestions.includes(index);

            return (
              <div
                key={index}
                className="flex items-start justify-between gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
              >
                <p className="text-[11px] sm:text-sm text-gray-800 font-heading leading-snug">
                  <span className="font-medium text-gray-900">
                    Q{index + 1}.
                  </span>{" "}
                  {q.text}
                </p>

                <span
                  className={`text-[6px] sm:text-[10px] sm:text-xs sm:px-2 px-1 py-0.5 rounded-full font-medium whitespace-nowrap
                    ${
                      isAnswered
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                >
                  {isAnswered ? "Answered" : "Not answered"}
                </span>
              </div>
            );
          })}
        </div>
      </Content>

      {/* FOOTER */}
      <Footer className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
        <p className="text-[11px] sm:text-sm text-gray-600 text-center md:text-left">
          {unanswered} question{unanswered !== 1 && "s"} remaining
        </p>

        <div className="flex gap-3 w-full md:w-auto">
          <Button
            $variation="secondary"
            className="flex-1 md:flex-none text-sm"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>

          <Button
            $variation="primary"
            className="flex-1 md:flex-none text-sm"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </Footer>
    </Container>
  );
}

export default ConfirmationQuestion;