import { useState, useEffect } from "react"
import {
  Plus,
  Pencil,
  Trash2,
  Code,
  Globe,
  Calculator,
  FlaskConical,
  Landmark,
  Loader2,
} from "lucide-react"

import axiosPrivate from "../../utils/axiosPrivate"
import axiosPublic from "../../utils/axiosPublic"

const iconMap = {
  "fa-code": Code,
  "fa-laptop-code": Globe,
  "fa-calculator": Calculator,
  "fa-flask": FlaskConical,
  "fa-landmark": Landmark,
}

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "fa-code",
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await axiosPublic.get("/categories")
      setCategories(res.data.data.allCategory)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return

    try {
      await axiosPrivate.delete(`/categories/${id}`)
      setCategories((prev) => prev.filter((c) => c._id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingCategory) {
        const res = await axiosPrivate.patch(
          `/categories/${editingCategory._id}`,
          formData
        )

        setCategories((prev) =>
          prev.map((c) =>
            c._id === editingCategory._id ? res.data.data : c
          )
        )
      } else {
        const res = await axiosPrivate.post("/categories", formData)
        setCategories((prev) => [...prev, res.data.data])
      }

      closeModal()
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon,
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
    setFormData({
      name: "",
      description: "",
      icon: "fa-code",
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
        <h1 className="text-2xl font-semibold">Categories</h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const Icon = iconMap[category.icon] || Code

          return (
            <div
              key={category._id}
              className="border rounded-lg p-5 bg-white hover:shadow-sm transition group"
            >
              {/* Top */}
              <div className="flex justify-between mb-3">
                <div className="p-2 bg-gray-100 rounded-md">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(category._id)}
                    className="p-1 hover:bg-red-100 text-red-500 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <h3 className="font-medium mb-1">{category.name}</h3>

              <p className="text-sm text-gray-500 mb-4">
                {category.description}
              </p>

              <div className="flex gap-4 text-xs text-gray-400">
                <span>{category.totalQuizzes || 0} quizzes</span>
                <span>
                  {(category.totalLearners || 0).toLocaleString()} learners
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty */}
      {categories.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No categories yet
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg p-6">

            <h2 className="text-lg font-semibold mb-4">
              {editingCategory ? "Edit Category" : "Add Category"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-md"
                required
              />

              <textarea
                rows="3"
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded-md"
                required
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