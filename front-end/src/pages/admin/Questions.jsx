import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Pencil, Trash2, Plus, ArrowLeft, Loader2 } from "lucide-react"

import axiosPrivate from "../../utils/axiosPrivate"

export default function QuizQuestions() {
  const { quizId } = useParams()
  const navigate = useNavigate()

  const [quiz, setQuiz] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)

  const [formData, setFormData] = useState({
    text: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
    points: 10,
    difficulty: "medium",
  })

  useEffect(() => {
    fetchData()
  }, [quizId])

  const fetchData = async () => {
    try {
      const [quizRes, qRes] = await Promise.all([
        axiosPrivate.get(`/quizzes/${quizId}`),
        axiosPrivate.get(`/questions/${quizId}`),
      ])

      setQuiz(quizRes.data.data.quiz)
      setQuestions(qRes.data.data.questions || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return

    try {
      await axiosPrivate.delete(`/questions/${id}`)
      setQuestions((prev) => prev.filter((q) => q._id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingQuestion) {
        const res = await axiosPrivate.patch(
          `/questions/${editingQuestion._id}`,
          formData
        )

        setQuestions((prev) =>
          prev.map((q) =>
            q._id === editingQuestion._id ? res.data.data : q
          )
        )
      } else {
        const res = await axiosPrivate.post(
          `/questions/${quizId}`,
          formData
        )

        setQuestions((prev) => [...prev, res.data.data])
      }

      closeModal()
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (q) => {
    setEditingQuestion(q)
    setFormData({
      text: q.text,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || "",
      points: q.points,
      difficulty: q.difficulty,
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingQuestion(null)
    setFormData({
      text: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      points: 10,
      difficulty: "medium",
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/quizzes")}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div>
            <h1 className="text-xl font-semibold">
              {quiz?.title}
            </h1>
            <p className="text-sm text-gray-400">
              Manage questions
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      {/* Cards */}
      <div className="grid gap-4">
        {questions.map((q, idx) => (
          <div
            key={q._id}
            className="border rounded-lg p-4 bg-white group"
          >
            {/* Top */}
            <div className="flex justify-between mb-2">
              <span className="text-xs text-gray-400">
                #{idx + 1}
              </span>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => handleEdit(q)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  onClick={() => handleDelete(q._id)}
                  className="p-1 hover:bg-red-100 text-red-500 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Question */}
            <p className="font-medium mb-2">{q.text}</p>

            {/* Options */}
            <div className="flex flex-wrap gap-2 mb-3">
              {q.options?.map((opt, i) => (
                <span
                  key={i}
                  className={`text-xs px-2 py-1 rounded ${
                    i === q.correctAnswer
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {opt}
                </span>
              ))}
            </div>

            {/* Meta */}
            <div className="flex gap-3 text-xs text-gray-400">
              <span>{q.difficulty}</span>
              <span>{q.points} pts</span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty */}
      {questions.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No questions yet
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-lg rounded-lg p-6 max-h-[90vh] overflow-y-auto">

            <h2 className="text-lg font-semibold mb-4">
              {editingQuestion ? "Edit" : "Add"} Question
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <textarea
                placeholder="Question"
                value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-md"
                required
              />

              {formData.options.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const newOptions = [...formData.options]
                    newOptions[i] = e.target.value
                    setFormData({ ...formData, options: newOptions })
                  }}
                  className="w-full border px-3 py-2 rounded-md"
                  required
                />
              ))}

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={formData.correctAnswer}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      correctAnswer: parseInt(e.target.value),
                    })
                  }
                  className="border px-3 py-2 rounded-md"
                >
                  <option value={0}>Option 1</option>
                  <option value={1}>Option 2</option>
                  <option value={2}>Option 3</option>
                  <option value={3}>Option 4</option>
                </select>

                <select
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      difficulty: e.target.value,
                    })
                  }
                  className="border px-3 py-2 rounded-md"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <input
                type="number"
                value={formData.points}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    points: parseInt(e.target.value),
                  })
                }
                className="w-full border px-3 py-2 rounded-md"
              />

              <textarea
                placeholder="Explanation (optional)"
                value={formData.explanation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    explanation: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded-md"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border py-2 rounded-md"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-black text-white py-2 rounded-md"
                >
                  Save
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  )
}