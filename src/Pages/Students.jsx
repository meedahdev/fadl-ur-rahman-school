import { useEffect, useState } from "react"
import Sidebar from "../Components/Sidebar"
import Topbar from "../Components/Topbar"
import { supabase } from "../Services/Supabase"

function Students() {
    const [search, setSearch] = useState("")
    const [students, setStudents] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const [editingStudent, setEditingStudent] = useState(null)

    const [formData, setFormData] = useState({
        name: "",
        gender: "",
        dateOfBirth: "",
        className: "",
        parent: "",
        phone: "",
        address: "",
        admissionDate: "",
    })

    // Fetch students
    const fetchStudents = async () => {
        setLoading(true)
        setError("")

        const { data, error } = await supabase
            .from("students")
            .select("*")
            .order("created_at", { ascending: false })

        if (error) {
            console.error(error)
            setError("Unable to load students.")
        } else {
            setStudents(data || [])
        }

        setLoading(false)
    }

    useEffect(() => {
        fetchStudents()
    }, [])

    // Handle form input
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    // Add or update student
    const handleSubmit = async (e) => {
        e.preventDefault()

        setSaving(true)
        setError("")

        if (editingStudent) {
            // UPDATE
            const { error } = await supabase
                .from("students")
                .update({
                    full_name: formData.name,
                    gender: formData.gender,
                    date_of_birth: formData.dateOfBirth,
                    class_name: formData.className,
                    parent_name: formData.parent,
                    parent_phone: formData.phone,
                    address: formData.address,
                    admission_date: formData.admissionDate,
                })
                .eq("id", editingStudent.id)

            if (error) {
                console.error(error)
                setError(error.message)
                setSaving(false)
                return
            }
        } else {
            // ADD
            const studentId = `ST${String(students.length + 1).padStart(3, "0")}`

            const { error } = await supabase
                .from("students")
                .insert([
                    {
                        student_id: studentId,
                        full_name: formData.name,
                        gender: formData.gender,
                        date_of_birth: formData.dateOfBirth,
                        class_name: formData.className,
                        parent_name: formData.parent,
                        parent_phone: formData.phone,
                        address: formData.address,
                        admission_date: formData.admissionDate,
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

        // Reset form
        setFormData({
            name: "",
            gender: "",
            dateOfBirth: "",
            className: "",
            parent: "",
            phone: "",
            address: "",
            admissionDate: "",
        })

        setEditingStudent(null)
        setShowModal(false)
        setSaving(false)

        fetchStudents()
    }

    // Open edit modal
    const handleEdit = (student) => {
        setEditingStudent(student)

        setFormData({
            name: student.full_name,
            gender: student.gender,
            dateOfBirth: student.date_of_birth,
            className: student.class_name,
            parent: student.parent_name,
            phone: student.parent_phone,
            address: student.address,
            admissionDate: student.admission_date,
        })

        setShowModal(true)
    }

    // Delete student
    const handleDelete = async (student) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${student.full_name}?`
        )

        if (!confirmed) return

        const { error } = await supabase
            .from("students")
            .delete()
            .eq("id", student.id)

        if (error) {
            console.error(error)
            setError(error.message)
            return
        }

        fetchStudents()
    }

    // Search
    const filteredStudents = students.filter((student) =>
        student.full_name.toLowerCase().includes(search.toLowerCase()) ||
        student.student_id.toLowerCase().includes(search.toLowerCase()) ||
        student.class_name.toLowerCase().includes(search.toLowerCase())
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
                                Students
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Manage pupil information and records.
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                setEditingStudent(null)

                                setFormData({
                                    name: "",
                                    gender: "",
                                    dateOfBirth: "",
                                    className: "",
                                    parent: "",
                                    phone: "",
                                    address: "",
                                    admissionDate: "",
                                })

                                setShowModal(true)
                            }}
                            className="rounded-lg bg-[#5C3317] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3E210E]"
                        >
                            + Add Student
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
                            placeholder="Search by student name, ID or class..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-[#D8C4B5] px-4 py-3 text-sm outline-none transition focus:border-[#5C3317] focus:ring-2 focus:ring-[#F3E8DC]"
                        />

                    </div>

                    {/* Table */}
                    <div className="overflow-hidden rounded-xl bg-white shadow-sm">

                        <div className="overflow-x-auto">

                            <table className="w-full text-left text-sm">

                                <thead className="bg-[#5C3317] text-white">

                                    <tr>
                                        <th className="px-5 py-4">Student ID</th>
                                        <th className="px-5 py-4">Name</th>
                                        <th className="px-5 py-4">Gender</th>
                                        <th className="px-5 py-4">Class</th>
                                        <th className="px-5 py-4">Parent/Guardian</th>
                                        <th className="px-5 py-4">Phone</th>
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
                                                Loading students...
                                            </td>
                                        </tr>

                                    ) : filteredStudents.length > 0 ? (

                                        filteredStudents.map((student) => (

                                            <tr
                                                key={student.id}
                                                className="border-b border-[#EDE2DA] transition hover:bg-[#F8F4F0]"
                                            >

                                                <td className="px-5 py-4 font-semibold text-[#5C3317]">
                                                    {student.student_id}
                                                </td>

                                                <td className="px-5 py-4 font-medium text-gray-800">
                                                    {student.full_name}
                                                </td>

                                                <td className="px-5 py-4 text-gray-600">
                                                    {student.gender}
                                                </td>

                                                <td className="px-5 py-4 text-gray-600">
                                                    {student.class_name}
                                                </td>

                                                <td className="px-5 py-4 text-gray-600">
                                                    {student.parent_name}
                                                </td>

                                                <td className="px-5 py-4 text-gray-600">
                                                    {student.parent_phone}
                                                </td>

                                                <td className="px-5 py-4">

                                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                                        {student.status}
                                                    </span>

                                                </td>

                                                {/* Actions */}
                                                <td className="px-5 py-4">

                                                    <div className="flex gap-2">

                                                        <button
                                                            onClick={() => handleEdit(student)}
                                                            className="rounded-lg bg-[#F3E8DC] px-3 py-2 text-xs font-semibold text-[#5C3317] transition hover:bg-[#E5D5C8]"
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            onClick={() => handleDelete(student)}
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
                                                No students found.
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
                                    {editingStudent ? "Edit Student" : "Add Student"}
                                </h2>

                                <p className="text-sm text-gray-500">
                                    {editingStudent
                                        ? "Update the student's information."
                                        : "Enter the student's information."
                                    }
                                </p>

                            </div>

                            <button
                                onClick={() => {
                                    setShowModal(false)
                                    setEditingStudent(null)
                                }}
                                className="text-2xl text-gray-400 hover:text-[#5C3317]"
                            >
                                ×
                            </button>

                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>

                            <div className="grid gap-5 md:grid-cols-2">

                                {/* Name */}
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

                                {/* Date of Birth */}
                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Date of Birth
                                    </label>

                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg border border-[#D8C4B5] px-4 py-3 outline-none focus:border-[#5C3317] focus:ring-2 focus:ring-[#F3E8DC]"
                                    />

                                </div>

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

                                {/* Parent */}
                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Parent/Guardian Name
                                    </label>

                                    <input
                                        type="text"
                                        name="parent"
                                        value={formData.parent}
                                        onChange={handleChange}
                                        placeholder="Enter parent/guardian name"
                                        required
                                        className="w-full rounded-lg border border-[#D8C4B5] px-4 py-3 outline-none focus:border-[#5C3317] focus:ring-2 focus:ring-[#F3E8DC]"
                                    />

                                </div>

                                {/* Phone */}
                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Parent/Guardian Phone
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

                                {/* Address */}
                                <div className="md:col-span-2">

                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Address
                                    </label>

                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Enter student's address"
                                        rows="3"
                                        required
                                        className="w-full rounded-lg border border-[#D8C4B5] px-4 py-3 outline-none focus:border-[#5C3317] focus:ring-2 focus:ring-[#F3E8DC]"
                                    ></textarea>

                                </div>

                                {/* Admission Date */}
                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Admission Date
                                    </label>

                                    <input
                                        type="date"
                                        name="admissionDate"
                                        value={formData.admissionDate}
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
                                    onClick={() => {
                                        setShowModal(false)
                                        setEditingStudent(null)
                                    }}
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
                                        : editingStudent
                                            ? "Update Student"
                                            : "Add Student"
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

export default Students