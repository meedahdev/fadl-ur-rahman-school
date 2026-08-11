import { useEffect, useState } from "react"
import Sidebar from "../Components/Sidebar"
import Topbar from "../Components/Topbar"
import { supabase } from "../Services/Supabase"


function Classes() {
  const [search, setSearch] = useState("")
  const [classes, setClasses] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [editingClass, setEditingClass] = useState(null)


  const [formData, setFormData] = useState({
    className: "",
    classTeacher: "",
    academicSession: "",
    room: "",
  })


  // Fetch classes
  const fetchClasses = async () => {
    setLoading(true)
    setError("")


    const { data, error } = await supabase
      .from("classes")
      .select("*")
      .order("created_at", { ascending: false })


    if (error) {
      console.error(error)
      setError("Unable to load classes.")
    } else {
      setClasses(data || [])
    }


    setLoading(false)
  }


  useEffect(() => {
    fetchClasses()
  }, [])


  // Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }


  // Reset form
  const resetForm = () => {
    setFormData({
      className: "",
      classTeacher: "",
      academicSession: "",
      room: "",
    })


    setEditingClass(null)
    setShowModal(false)
    setSaving(false)
  }


  // Add or update class
  const handleSubmit = async (e) => {
    e.preventDefault()


    setSaving(true)
    setError("")


    if (editingClass) {

      const { error } = await supabase
        .from("classes")
        .update({
          class_name: formData.className,
          class_teacher: formData.classTeacher,
          academic_session: formData.academicSession,
          room: formData.room,
        })
        .eq("id", editingClass.id)


      if (error) {
        console.error(error)
        setError(error.message)
        setSaving(false)
        return
      }


    } else {

      const { error } = await supabase
        .from("classes")
        .insert([
          {
            class_name: formData.className,
            class_teacher: formData.classTeacher,
            academic_session: formData.academicSession,
            room: formData.room,
            status: "Active",
          },
        ])


      if (error) {
        console.error(error)
        setError(error.message)
        setSaving(false)
        return
      }
    }


    resetForm()
    fetchClasses()
  }


  // Edit class
  const handleEdit = (schoolClass) => {
    setEditingClass(schoolClass)


    setFormData({
      className: schoolClass.class_name,
      classTeacher: schoolClass.class_teacher,
      academicSession: schoolClass.academic_session,
      room: schoolClass.room,
    })


    setShowModal(true)
  }


  // Delete class
  const handleDelete = async (schoolClass) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${schoolClass.class_name}?`
    )


    if (!confirmed) return


    const { error } = await supabase
      .from("classes")
      .delete()
      .eq("id", schoolClass.id)


    if (error) {
      console.error(error)
      setError(error.message)
      return
    }


    fetchClasses()
  }


  // Search
  const filteredClasses = classes.filter((schoolClass) =>
    schoolClass.class_name
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    schoolClass.class_teacher
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    schoolClass.academic_session
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    schoolClass.room
      .toLowerCase()
      .includes(search.toLowerCase())
  )


  return (
    <div className="min-h-screen bg-[#F8F4F0]">


      <Sidebar />


      <div className="ml-64">


        <Topbar />


        <main className="p-6">


          {/* Header */}
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">


            <div>
              <h1 className="text-2xl font-bold text-[#5C3317]">
                Classes
              </h1>


              <p className="mt-1 text-sm text-[#7A5A43]">
                Manage school classes and class teachers.
              </p>
            </div>


            <button
              onClick={() => {
                resetForm()
                setShowModal(true)
              }}
              className="rounded-lg bg-[#5C3317] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3E210E]"
            >
              + Add Class
            </button>


          </div>


          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}


          {/* Search */}
          <div className="mb-6 rounded-xl border border-[#E6D6C8] bg-white p-4 shadow-sm">


            <input
              type="text"
              placeholder="Search by class, teacher, session or room..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[#D8C4B5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#5C3317] focus:ring-2 focus:ring-[#F3E8DC]"
            />


          </div>


          {/* Classes Table */}
          <div className="overflow-hidden rounded-xl border border-[#E6D6C8] bg-white shadow-sm">


            <div className="overflow-x-auto">


              <table className="w-full text-left text-sm">


                <thead className="bg-[#5C3317] text-white">


                  <tr>
                    <th className="px-5 py-4">Class</th>
                    <th className="px-5 py-4">Class Teacher</th>
                    <th className="px-5 py-4">Academic Session</th>
                    <th className="px-5 py-4">Room</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>


                </thead>


                <tbody>


                  {loading ? (


                    <tr>
                      <td
                        colSpan="6"
                        className="px-5 py-10 text-center text-[#7A5A43]"
                      >
                        Loading classes...
                      </td>
                    </tr>


                  ) : filteredClasses.length > 0 ? (


                    filteredClasses.map((schoolClass) => (


                      <tr
                        key={schoolClass.id}
                        className="border-b border-[#EDE2DA] transition hover:bg-[#F8F4F0]"
                      >


                        <td className="px-5 py-4 font-semibold text-[#5C3317]">
                          {schoolClass.class_name}
                        </td>


                        <td className="px-5 py-4 text-gray-700">
                          {schoolClass.class_teacher}
                        </td>


                        <td className="px-5 py-4 text-gray-600">
                          {schoolClass.academic_session}
                        </td>


                        <td className="px-5 py-4 text-gray-600">
                          {schoolClass.room}
                        </td>


                        <td className="px-5 py-4">


                          <span className="rounded-full bg-[#F3E8DC] px-3 py-1 text-xs font-semibold text-[#5C3317]">
                            {schoolClass.status}
                          </span>


                        </td>


                        <td className="px-5 py-4">


                          <div className="flex gap-2">


                            <button
                              onClick={() => handleEdit(schoolClass)}
                              className="rounded-lg bg-[#F3E8DC] px-3 py-2 text-xs font-semibold text-[#5C3317] transition hover:bg-[#E5D5C8]"
                            >
                              Edit
                            </button>


                            <button
                              onClick={() => handleDelete(schoolClass)}
                              className="rounded-lg bg-[#FDECEC] px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                            >
                              Delete
                            </button>


                          </div>


                        </td>


                      </tr>


                    ))


                  ) : (


                    <tr>
                      <td
                        colSpan="6"
                        className="px-5 py-10 text-center text-[#7A5A43]"
                      >
                        No classes found.
                      </td>
                    </tr>


                  )}


                </tbody>


              </table>


            </div>


          </div>


        </main>


      </div>


      {/* Add/Edit Modal */}
      {showModal && (


        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">


          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">


            {/* Modal Header */}
            <div className="mb-6 flex items-center justify-between">


              <div>
                <h2 className="text-xl font-bold text-[#5C3317]">
                  {editingClass ? "Edit Class" : "Add Class"}
                </h2>


                <p className="text-sm text-[#7A5A43]">
                  {editingClass
                    ? "Update class information."
                    : "Enter class information."
                  }
                </p>


              </div>


              <button
                onClick={resetForm}
                className="text-2xl text-gray-400 transition hover:text-[#5C3317]"
              >
                ×
              </button>


            </div>


            {/* Form */}
            <form onSubmit={handleSubmit}>


              <div className="grid gap-5 md:grid-cols-2">


                {/* Class Name */}
                <div>


                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Class Name
                  </label>


                  <select
                    name="className"
                    value={formData.className}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-[#D8C4B5] bg-white px-4 py-3 text-gray-700 outline-none focus:border-[#5C3317] focus:ring-2 focus:ring-[#F3E8DC]"
                  >


                    <option value="">Select class</option>

                    <option value="Creche">
                      Creche
                    </option>

                    <option value="Prep">
                      Prep
                    </option>

                    <option value="Nur 1">
                      Nur 1
                    </option>

                    <option value="Nur 2">
                      Nur 2
                    </option>

                    <option value="KG">
                      KG
                    </option>

                    <option value="Basic 1">
                      Basic 1
                    </option>

                    <option value="Basic 2">
                      Basic 2
                    </option>

                    <option value="Basic 3">
                      Basic 3
                    </option>

                    <option value="Basic 4">
                      Basic 4
                    </option>

                    <option value="Basic 5">
                      Basic 5
                    </option>


                  </select>


                </div>


                {/* Class Teacher */}
                <div>


                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Class Teacher
                  </label>


                  <input
                    type="text"
                    name="classTeacher"
                    value={formData.classTeacher}
                    onChange={handleChange}
                    placeholder="Enter class teacher"
                    required
                    className="w-full rounded-lg border border-[#D8C4B5] px-4 py-3 text-gray-700 outline-none focus:border-[#5C3317] focus:ring-2 focus:ring-[#F3E8DC]"
                  />


                </div>


                {/* Academic Session */}
                <div>


                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Academic Session
                  </label>


                  <input
                    type="text"
                    name="academicSession"
                    value={formData.academicSession}
                    onChange={handleChange}
                    placeholder="e.g. 2026/2027"
                    required
                    className="w-full rounded-lg border border-[#D8C4B5] px-4 py-3 text-gray-700 outline-none focus:border-[#5C3317] focus:ring-2 focus:ring-[#F3E8DC]"
                  />


                </div>


                {/* Room */}
                <div>


                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Room
                  </label>


                  <input
                    type="text"
                    name="room"
                    value={formData.room}
                    onChange={handleChange}
                    placeholder="e.g. Block A - Room 3"
                    required
                    className="w-full rounded-lg border border-[#D8C4B5] px-4 py-3 text-gray-700 outline-none focus:border-[#5C3317] focus:ring-2 focus:ring-[#F3E8DC]"
                  />


                </div>


              </div>


              {/* Buttons */}
              <div className="mt-7 flex justify-end gap-3">


                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-[#D8C4B5] px-5 py-3 text-sm font-semibold text-[#5C3317] transition hover:bg-[#F8F4F0]"
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#5C3317] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3E210E] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingClass
                      ? "Update Class"
                      : "Add Class"
                  }
                </button>


              </div>


            </form>


          </div>


        </div>


      )}


    </div>
  )
}


export default Classes

