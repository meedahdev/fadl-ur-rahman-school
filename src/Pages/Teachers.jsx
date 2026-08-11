import { useEffect, useState } from "react"
import Sidebar from "../Components/Sidebar"
import Topbar from "../Components/Topbar"
import { supabase } from "../Services/Supabase"

function Teachers() {
    const [search, setSearch] = useState("")
    const [teachers, setTeachers] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const [editingTeacher, setEditingTeacher] = useState(null)

    const [formData, setFormData] = useState({
        name: "",
        gender: "",
        phone: "",
        email: "",
        subject: "",
        className: "",
        address: "",
        employmentDate: "",
    })

    // Fetch teachers
    const fetchTeachers = async () => {
        setLoading(true)
        setError("")

        const { data, error } = await supabase
            .from("teachers")
            .select("*")
            .order("created_at", { ascending: false })

        if (error) {
            console.error(error)
            setError("Unable to load teachers.")
        } else {
            setTeachers(data || [])
        }

        setLoading(false)
    }

    useEffect(() => {
        fetchTeachers()
    }, [])

    // Handle form input
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    // Add or update teacher
    const handleSubmit = async (e) => {
        e.preventDefault()

        setSaving(true)
        setError("")

        if (editingTeacher) {

            const { error } = await supabase
                .from("teachers")
                .update({
                    full_name: formData.name,
                    gender: formData.gender,
                    phone: formData.phone,
                    email: formData.email,
                    subject: formData.subject,
                    class_name: formData.className,
                    address: formData.address,
                    employment_date: formData.employmentDate,
                })
                .eq("id", editingTeacher.id)

            if (error) {
                console.error(error)
                setError(error.message)
                setSaving(false)
                return
            }

        } else {

            const teacherId = `TCH${String(teachers.length + 1).padStart(3, "0")}`

            const { error } = await supabase
                .from("teachers")
                .insert([
                    {
                        teacher_id: teacherId,
                        full_name: formData.name,
                        gender: formData.gender,
                        phone: formData.phone,
                        email: formData.email,
                        subject: formData.subject,
                        class_name: formData.className,
                        address: formData.address,
                        employment_date: formData.employmentDate,
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
        fetchTeachers()
    }

    // Reset form
    const resetForm = () => {
        setFormData({
            name: "",
            gender: "",
            phone: "",
            email: "",
            subject: "",
            className: "",
            address: "",
            employmentDate: "",
        })

        setEditingTeacher(null)
        setShowModal(false)
        setSaving(false)
    }

    // Edit teacher
    const handleEdit = (teacher) => {
        setEditingTeacher(teacher)

        setFormData({
            name: teacher.full_name,
            gender: teacher.gender,
            phone: teacher.phone,
            email: teacher.email,
            subject: teacher.subject,
            className: teacher.class_name,
            address: teacher.address,
            employmentDate: teacher.employment_date,
        })

        setShowModal(true)
    }

    // Delete teacher
    const handleDelete = async (teacher) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${teacher.full_name}?`
        )

        if (!confirmed) return

        const { error } = await supabase
            .from("teachers")
            .delete()
            .eq("id", teacher.id)

        if (error) {
            console.error(error)
            setError(error.message)
            return
        }

        fetchTeachers()
    }

    // Search
    const filteredTeachers = teachers.filter((teacher) =>
        teacher.full_name.toLowerCase().includes(search.toLowerCase()) ||
        teacher.teacher_id.toLowerCase().includes(search.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(search.toLowerCase()) ||
        teacher.class_name.toLowerCase().includes(search.toLowerCase())
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
                                Teachers
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Manage teacher information and records.
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                resetForm()
                                setShowModal(true)
                            }}
                            className="rounded-lg bg-[#5C3317] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3E210E]"
                        >
                            + Add Teacher
                        </button>

                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Search */}
                    <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">

                        <input
                            type="text"
                            placeholder="Search by teacher name, ID, subject or class..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-[#D8C4B5] px-4 py-3 text-sm outline-none transition focus:border-[#5C3317] focus:ring-2 focus:ring-[#F3E8DC]"
                        />

                    </div>

                    {/* Teachers Table */}
                    <div className="overflow-hidden rounded-xl bg-white shadow-sm">

                        <div className="overflow-x-auto">

                            <table className="w-full text-left text-sm">

                                <thead className="bg-[#5C3317] text-white">

                                    <tr>
                                        <th className="px-5 py-4">Teacher ID</th>
                                        <th className="px-5 py-4">Name</th>
                                        <th className="px-5 py-4">Gender</th>
                                        <th className="px-5 py-4">Phone</th>
                                        <th className="px-5 py-4">Subject</th>
                                        <th className="px-5 py-4">Class</th>
                                        <th className="px-5 py-4">Status</th>
                                        <th className="px-5 py-4">Actions</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {loading ? (

                                        <tr>
                                            <td
                                                colSpan="8"
                                                className="px-5 py-10 text-center text-gray-500"
                                            >
                                                Loading teachers...
                                            </td>
                                        </tr>

                                    ) : filteredTeachers.length > 0 ? (

                                        filteredTeachers.map((teacher) => (

                                            <tr
                                                key={teacher.id}
                                                className="border-b border-[#EDE2DA] transition hover:bg-[#F8F4F0]"
                                            >

                                                <td className="px-5 py-4 font-semibold text-[#5C3317]">
                                                    {teacher.teacher_id}
                                                </td>

                                                <td className="px-5 py-4 font-medium text-gray-800">
                                                    {teacher.full_name}
                                                </td>

                                                <td className="px-5 py-4 text-gray-600">
                                                    {teacher.gender}
                                                </td>

                                                <td className="px-5 py-4 text-gray-600">
                                                    {teacher.phone}
                                                </td>

                                                <td className="px-5 py-4 text-gray-600">
                                                    {teacher.subject}
                                                </td>

                                                <td className="px-5 py-4 text-gray-600">
                                                    {teacher.class_name}
                                                </td>

                                                <td className="px-5 py-4">

                                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                                        {teacher.status}
                                                    </span>

                                                </td>

                                                <td className="px-5 py-4">

                                                    <div className="flex gap-2">

                                                        <button
                                                            onClick={() => handleEdit(teacher)}
                                                            className="rounded-lg bg-[#F3E8DC] px-3 py-2 text-xs font-semibold text-[#5C3317] transition hover:bg-[#E5D5C8]"
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            onClick={() => handleDelete(teacher)}
                                                            className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
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
                                                colSpan="8"
                                                className="px-5 py-10 text-center text-gray-500"
                                            >
                                                No teachers found.
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

                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

                        {/* Modal Header */}
                        <div className="mb-6 flex items-center justify-between">

                            <div>

                                <h2 className="text-xl font-bold text-[#5C3317]">
                                    {editingTeacher ? "Edit Teacher" : "Add Teacher"}
                                </h2>

                                <p className="text-sm text-gray-500">
                                    {editingTeacher
                                        ? "Update the teacher's information."
                                        : "Enter the teacher's information."
                                    }
                                </p>

                            </div>

                            <button
                                onClick={resetForm}
                                className="text-2xl text-gray-400 hover:text-[#5C3317]"
                            >
                                ×
                            </button>

                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>

                            <div className="grid gap-5 md:grid-cols-2">

                                {/* Full Name */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter full name"
                                        required
                                        className="w-full rounded-lg border border-[#D8C4B5] px-4 py-3 outline-none focus:border-[#5C3317] focus:ring-2 focus:ring-[#F3E8DC]"
                                    />
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Gender
                                    </label>

                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg border border-[#D8C4B5] bg-white px-4 py-3 outline-none focus:border-[#5C3317] focus:ring-2 focus:ring-[#F3E8DC]"
                                    >
                                        <option value="">Select gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Phone Number
                                    </label>

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                        required
                                        className="w-full rounded-lg border border-[#D8C4B5] px-4 py-3 outline-none focus:border-[#5C3317] focus:ring-2 focus:ring-[#F3E8DC]"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter email address"
                                        required
                                        className="w-full rounded-lg border border-[#D8C4B5] px-4 py-3 outline-none focus:border-[#5C3317] focus:ring-2 focus:ring-[#F3E8DC]"
                                    />
                                </div>

                                {/* Subject */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Subject
                                    </label>

                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="e.g. Mathematics"
                                        required
                                        className="w-full rounded-lg border border-[#D8C4B5] px-4 py-3 outline-none focus:border-[#5C3317] focus:ring-2 focus:ring-[#F3E8DC]"
                                    />
                                </div>

                                {/* Class */}
                                {/* Class */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Class
                                    </label>

                                    <select
                                        name="className"
                                        value={formData.className}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg border border-[#D8C4B5] bg-white px-4 py-3 outline-none focus:border-[#5C3317] focus:ring-2 focus:ring-[#F3E8DC]"
                                    >
                                        <option value="">Select class</option>
                                        <option value="Creche">Creche</option>
                                        <option value="Prep">Prep</option>
                                        <option value="Nur 1">Nur 1</option>
                                        <option value="Nur 2">Nur 2</option>
                                        <option value="KG">KG</option>
                                        <option value="Basic 1">Basic 1</option>
                                        <option value="Basic 2">Basic 2</option>
                                        <option value="Basic 3">Basic 3</option>
                                        <option value="Basic 4">Basic 4</option>
                                        <option value="Basic 5">Basic 5</option>
                                    </select>
                                </div>

                                {/* Address */}
                                <div className="md:col-span-2">

                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Address
                                    </label>

                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Enter teacher's address"
                                        rows="3"
                                        required
                                        className="w-full rounded-lg border border-[#D8C4B5] px-4 py-3 outline-none focus:border-[#5C3317] focus:ring-2 focus:ring-[#F3E8DC]"
                                    ></textarea>

                                </div>

                                {/* Employment Date */}
                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Employment Date
                                    </label>

                                    <input
                                        type="date"
                                        name="employmentDate"
                                        value={formData.employmentDate}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg border border-[#D8C4B5] px-4 py-3 outline-none focus:border-[#5C3317] focus:ring-2 focus:ring-[#F3E8DC]"
                                    />

                                </div>

                            </div>

                            {/* Buttons */}
                            <div className="mt-7 flex justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-lg border border-[#D8C4B5] px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-[#F8F4F0]"
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
                                        : editingTeacher
                                            ? "Update Teacher"
                                            : "Add Teacher"
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

export default Teachers