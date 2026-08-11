import { useEffect, useState } from "react"
import Sidebar from "../Components/Sidebar"
import Topbar from "../Components/Topbar"
import { supabase } from "../Services/Supabase"


function Attendance() {
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  )

  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")


  const classes = [
    "Creche",
    "Prep",
    "Nur 1",
    "Nur 2",
    "KG",
    "Basic 1",
    "Basic 2",
    "Basic 3",
    "Basic 4",
    "Basic 5",
  ]


  // Fetch students when class changes
  const fetchStudents = async () => {
    if (!selectedClass) {
      setStudents([])
      setAttendance({})
      return
    }

    setLoading(true)
    setError("")
    setMessage("")


    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("class_name", selectedClass)
      .order("full_name", { ascending: true })


    if (error) {
      console.error(error)
      setError(error.message)
      setStudents([])
      setLoading(false)
      return
    }


    setStudents(data || [])


    const defaultAttendance = {}

    data?.forEach((student) => {
      defaultAttendance[student.id] = "Present"
    })

    setAttendance(defaultAttendance)

    setLoading(false)
  }


  useEffect(() => {
    fetchStudents()
  }, [selectedClass])


  // Change attendance status
  const handleAttendanceChange = (studentId, status) => {
    setAttendance({
      ...attendance,
      [studentId]: status,
    })
  }


  // Save attendance
  const handleSaveAttendance = async () => {
    if (!selectedClass) {
      setError("Please select a class first.")
      return
    }

    if (students.length === 0) {
      setError("There are no students in this class.")
      return
    }


    setSaving(true)
    setError("")
    setMessage("")


    // Remove existing attendance for this date/class
    const studentIds = students.map((student) => student.id)


    const { error: deleteError } = await supabase
      .from("attendance")
      .delete()
      .in("student_id", studentIds)
      .eq("attendance_date", selectedDate)


    if (deleteError) {
      console.error(deleteError)
      setError(deleteError.message)
      setSaving(false)
      return
    }


    // Create new attendance records
    const records = students.map((student) => ({
      student_id: student.id,
      attendance_date: selectedDate,
      status: attendance[student.id] || "Present",
    }))


    const { error: insertError } = await supabase
      .from("attendance")
      .insert(records)


    if (insertError) {
      console.error(insertError)
      setError(insertError.message)
      setSaving(false)
      return
    }


    setMessage("Attendance saved successfully.")
    setSaving(false)
  }


  return (
    <div className="min-h-screen bg-[#F8F4F0]">

      <Sidebar />

      <div className="ml-64">

        <Topbar />

        <main className="p-6">

          {/* Header */}
          <div className="mb-6">

            <h1 className="text-2xl font-bold text-[#5C3317]">
              Attendance
            </h1>

            <p className="mt-1 text-sm text-[#7A5A43]">
              Record and manage student attendance.
            </p>

          </div>


          {/* Filters */}
          <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">

            <div className="grid gap-5 md:grid-cols-2">

              {/* Class */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Select Class
                </label>

                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full rounded-lg border border-[#D8C4B5] bg-white px-4 py-3 outline-none focus:border-[#5C3317] focus:ring-2 focus:ring-[#F3E8DC]"
                >

                  <option value="">
                    Select class
                  </option>

                  {classes.map((className) => (
                    <option key={className} value={className}>
                      {className}
                    </option>
                  ))}

                </select>

              </div>


              {/* Date */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Attendance Date
                </label>

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-lg border border-[#D8C4B5] px-4 py-3 outline-none focus:border-[#5C3317] focus:ring-2 focus:ring-[#F3E8DC]"
                />

              </div>

            </div>

          </div>


          {/* Messages */}
          {error && (
            <div className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-5 rounded-lg bg-[#F3E8DC] p-4 text-sm font-semibold text-[#5C3317]">
              {message}
            </div>
          )}


          {/* Students */}
          {selectedClass && (

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">

              <div className="flex items-center justify-between border-b border-[#EDE2DA] px-5 py-4">

                <div>

                  <h2 className="font-bold text-[#5C3317]">
                    {selectedClass}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {students.length} student{students.length !== 1 ? "s" : ""}
                  </p>

                </div>

              </div>


              {loading ? (

                <div className="px-5 py-10 text-center text-gray-500">
                  Loading students...
                </div>

              ) : students.length > 0 ? (

                <div className="overflow-x-auto">

                  <table className="w-full text-left text-sm">

                    <thead className="bg-[#5C3317] text-white">

                      <tr>

                        <th className="px-5 py-4">
                          Student ID
                        </th>

                        <th className="px-5 py-4">
                          Student Name
                        </th>

                        <th className="px-5 py-4">
                          Attendance
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {students.map((student) => (

                        <tr
                          key={student.id}
                          className="border-b border-[#EDE2DA] hover:bg-[#F8F4F0]"
                        >

                          <td className="px-5 py-4 font-semibold text-[#5C3317]">
                            {student.student_id}
                          </td>

                          <td className="px-5 py-4 font-medium text-gray-800">
                            {student.full_name}
                          </td>

                          <td className="px-5 py-4">

                            <div className="flex gap-2">

                              <button
                                onClick={() =>
                                  handleAttendanceChange(
                                    student.id,
                                    "Present"
                                  )
                                }
                                className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                                  attendance[student.id] === "Present"
                                    ? "bg-[#5C3317] text-white"
                                    : "bg-[#F3E8DC] text-[#5C3317]"
                                }`}
                              >
                                Present
                              </button>


                              <button
                                onClick={() =>
                                  handleAttendanceChange(
                                    student.id,
                                    "Absent"
                                  )
                                }
                                className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                                  attendance[student.id] === "Absent"
                                    ? "bg-red-600 text-white"
                                    : "bg-red-50 text-red-600"
                                }`}
                              >
                                Absent
                              </button>

                            </div>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              ) : (

                <div className="px-5 py-10 text-center text-gray-500">
                  No students found in this class.
                </div>

              )}


              {/* Save Button */}
              {students.length > 0 && (

                <div className="flex justify-end border-t border-[#EDE2DA] p-5">

                  <button
                    onClick={handleSaveAttendance}
                    disabled={saving}
                    className="rounded-lg bg-[#5C3317] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#3E210E] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving
                      ? "Saving..."
                      : "Save Attendance"
                    }
                  </button>

                </div>

              )}

            </div>

          )}


          {/* Empty State */}
          {!selectedClass && (

            <div className="rounded-xl bg-white px-5 py-12 text-center shadow-sm">

              <h2 className="text-lg font-bold text-[#5C3317]">
                Select a class
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Choose a class above to view students and record attendance.
              </p>

            </div>

          )}

        </main>

      </div>

    </div>
  )
}


export default Attendance