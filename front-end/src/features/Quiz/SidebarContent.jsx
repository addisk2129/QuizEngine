import { useDispatch, useSelector } from 'react-redux'
import { setCurrentQuestion } from './QuizSlice'
import QuestionBtn from './TakeQuiz/QuestionBtn'

function SidebarContent({ type }) {
  const dispatch = useDispatch()
  const { currentQuestionIndex, answeredQuestions, questions, answers } = useSelector(
    (store) => store.quizz
  )

  const isAnswered = (index) => answeredQuestions.includes(index)

  const isCorrect = (index) => {
    const selectedOption = answers[index]
    const question = questions?.[index]
    if (selectedOption === undefined || !question) return false
    return selectedOption === question.correctAnswer
  }

  const showAnsweredStatus = type === 'take' || type === 'confirmation'
  const showResultStatus = type === 'result'

  // Loading state
  if (!questions || questions.length === 0) {
    return (
      <aside className="flex h-full items-center justify-center bg-gray-100 border-r border-gray-200 p-4">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary-600" />
      </aside>
    )
  }

  // Status legend items
  const statusItems = [
    showAnsweredStatus && { color: 'bg-primary-600', label: 'Answered' },
    { color: 'bg-blue-900', label: 'Current' },
    showResultStatus && { color: 'bg-green-600', label: 'Correct' },
    showResultStatus && { color: 'bg-red-600', label: 'Incorrect' },
    { color: 'border border-gray-400', label: 'Not Visited' },
  ].filter(Boolean)

  return (
    <aside className="h-full flex flex-col bg-gray-50 border-r">

{/* Header */}
<div className="p-3 border-b">
  <h3 className="text-sm font-semibold text-gray-700">
    Questions
  </h3>
</div>

{/* Grid */}
<div className="flex-1 overflow-y-auto p-3">
  <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-4 gap-2">
    {questions.map((_, index) => (
      <QuestionBtn
        key={index}
        onClick={() => dispatch(setCurrentQuestion(index))}
        $current={index === currentQuestionIndex}
        $answered={showAnsweredStatus && isAnswered(index)}
        $correct={showResultStatus && isAnswered(index) && isCorrect(index)}
        $incorrect={showResultStatus && isAnswered(index) && !isCorrect(index)}
      >
        {index + 1}
      </QuestionBtn>
    ))}
  </div>
</div>

{/* Footer */}
<div className="p-3 border-t bg-white">
  <p className="text-xs font-semibold text-gray-600 mb-2">Status</p>

  <div className="flex flex-wrap gap-2 text-xs">
    {statusItems.map((item) => (
      <div key={item.label} className="flex items-center gap-1">
        <span className={`w-2 h-2 rounded-full ${item.color}`} />
        {item.label}
      </div>
    ))}
  </div>
</div>

</aside>
  )
}

export default SidebarContent