import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Eye,
  Clock,
  HelpCircle,
  Star,
} from "lucide-react"

import axiosPrivate from "../../utils/axiosPrivate"
import axiosPublic from "../../utils/axiosPublic"

export default function Quizzes() {
  const navigate = useNavigate()

  const [quizzes, setQuizzes] = useState([])
  const [categories, setCategories] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState(null)
  const [loading, setLoading] = useState(true)

  const [quizFormData, setQuizFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    difficulty: "Intermediate",
    duration: 30,
    passingScore: 70,
    isFeatured: false,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [quizRes, catRes] = await Promise.all([
        axiosPublic.get("/quizzes"),
        axiosPublic.get("/categories"),
      ])

      setQuizzes(quizRes.data.data.quizzes)
      setCategories(catRes.data.data.allCategory)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm("Delete this quiz?")) return

    try {
      await axiosPrivate.delete(`/quizzes/${id}`)
      setQuizzes((prev) => prev.filter((q) => q._id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingQuiz) {
        const res = await axiosPrivate.patch(
          `/quizzes/${editingQuiz._id}`,
          quizFormData
        )

        setQuizzes((prev) =>
          prev.map((q) =>
            q._id === editingQuiz._id ? res.data.data : q
          )
        )
      } else {
        const res = await axiosPrivate.post("/quizzes", quizFormData)
        setQuizzes((prev) => [...prev, res.data.data])
      }

      closeModal()
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (quiz) => {
    setEditingQuiz(quiz)
    setQuizFormData({
      title: quiz.title,
      description: quiz.description,
      categoryId: quiz.categoryId?._id || quiz.categoryId,
      difficulty: quiz.difficulty,
      duration: quiz.duration,
      passingScore: quiz.passingScore,
      isFeatured: quiz.isFeatured,
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingQuiz(null)
    setQuizFormData({
      title: "",
      description: "",
      categoryId: "",
      difficulty: "Intermediate",
      duration: 30,
      passingScore: 70,
      isFeatured: false,
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
        <h1 className="text-2xl font-semibold">Quizzes</h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Quiz
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes.map((quiz) => (
          <div
            key={quiz._id}
            className="border rounded-lg p-5 bg-white hover:shadow-sm transition group"
          >
            {/* Top */}
            <div className="flex justify-between mb-3">
              <div>
                <h3 className="font-medium">{quiz.title}</h3>
                <p className="text-xs text-gray-400">
                  {quiz.categoryId?.name}
                </p>
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => handleEdit(quiz)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  onClick={() => handleDeleteQuiz(quiz._id)}
                  className="p-1 hover:bg-red-100 text-red-500 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-500 mb-4">
              {quiz.description}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-4">
              <span className="flex items-center gap-1">
                <HelpCircle className="h-3 w-3" />
                {quiz.totalQuestions || 0}
              </span>

              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {quiz.duration} min
              </span>

              <span>{quiz.difficulty}</span>

              {quiz.isFeatured && (
                <Star className="h-3 w-3 text-yellow-500" />
              )}
            </div>

            {/* Action */}
            <button
              onClick={() =>
                navigate(`/admin/quizzes/${quiz._id}/questions`)
              }
              className="w-full text-sm border py-2 rounded-md hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View Questions
            </button>
          </div>
        ))}
      </div>

      {/* Empty */}
      {quizzes.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No quizzes yet
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg p-6 max-h-[90vh] overflow-y-auto">

            <h2 className="text-lg font-semibold mb-4">
              {editingQuiz ? "Edit Quiz" : "Add Quiz"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                placeholder="Title"
                value={quizFormData.title}
                onChange={(e) =>
                  setQuizFormData({ ...quizFormData, title: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-md"
                required
              />

              <select
                value={quizFormData.categoryId}
                onChange={(e) =>
                  setQuizFormData({ ...quizFormData, categoryId: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-md"
                required
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <textarea
                rows="3"
                placeholder="Description"
                value={quizFormData.description}
                onChange={(e) =>
                  setQuizFormData({
                    ...quizFormData,
                    description: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded-md"
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={quizFormData.difficulty}
                  onChange={(e) =>
                    setQuizFormData({
                      ...quizFormData,
                      difficulty: e.target.value,
                    })
                  }
                  className="border px-3 py-2 rounded-md"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>

                <input
                  type="number"
                  value={quizFormData.duration}
                  onChange={(e) =>
                    setQuizFormData({
                      ...quizFormData,
                      duration: parseInt(e.target.value),
                    })
                  }
                  className="border px-3 py-2 rounded-md"
                />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={quizFormData.isFeatured}
                  onChange={(e) =>
                    setQuizFormData({
                      ...quizFormData,
                      isFeatured: e.target.checked,
                    })
                  }
                />
                Featured
              </label>

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