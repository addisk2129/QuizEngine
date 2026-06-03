import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Loader2, Search } from "lucide-react"

import axiosPrivate from "../../utils/axiosPrivate"

export default function Users() {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    role: "user",
    password: "",
    passwordConfirm: "",
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await axiosPrivate.get("/users")
      setUsers(res.data.data.users)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return

    try {
      await axiosPrivate.delete(`/users/${id}`)
      setUsers((prev) => prev.filter((u) => u._id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingUser) {
        const res = await axiosPrivate.patch(
          `/users/${editingUser._id}`,
          {
            userName: formData.userName,
            email: formData.email,
            role: formData.role,
          }
        )

        setUsers((prev) =>
          prev.map((u) =>
            u._id === editingUser._id ? res.data.data : u
          )
        )
      } else {
        const res = await axiosPrivate.post("/users", formData)
        setUsers((prev) => [...prev, res.data.data])
      }

      closeModal()
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      userName: user.userName,
      email: user.email,
      role: user.role,
      password: "",
      passwordConfirm: "",
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingUser(null)
    setFormData({
      userName: "",
      email: "",
      role: "user",
      password: "",
      passwordConfirm: "",
    })
  }

  const filteredUsers = users.filter(
    (u) =>
      u.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
        <h1 className="text-2xl font-semibold">Users</h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border pl-10 pr-3 py-2 rounded-md"
        />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="border rounded-lg p-4 bg-white group"
          >
            {/* Top */}
            <div className="flex justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                  {user.userName?.[0]}
                </div>

                <div>
                  <p className="font-medium">{user.userName}</p>
                  <p className="text-xs text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => handleEdit(user)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  onClick={() => handleDelete(user._id)}
                  className="p-1 hover:bg-red-100 text-red-500 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Meta */}
            <div className="flex justify-between text-xs text-gray-400">
              <span>{user.role}</span>
              <span>{user.quizzesTaken || 0} quizzes</span>
            </div>

            <div className="text-xs text-green-600 mt-1">
              {user.avgScore || 0}%
            </div>
          </div>
        ))}
      </div>

      {/* Empty */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No users found
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg p-6">

            <h2 className="text-lg font-semibold mb-4">
              {editingUser ? "Edit User" : "Add User"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                placeholder="Username"
                value={formData.userName}
                onChange={(e) =>
                  setFormData({ ...formData, userName: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-md"
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-md"
                required
              />

              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-md"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              {!editingUser && (
                <>
                  <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                    className="w-full border px-3 py-2 rounded-md"
                    required
                  />

                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.passwordConfirm}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        passwordConfirm: e.target.value,
                      })
                    }
                    className="w-full border px-3 py-2 rounded-md"
                    required
                  />
                </>
              )}

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