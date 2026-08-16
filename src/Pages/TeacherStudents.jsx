import { useEffect, useState } from "react"
import Sidebar from "../Components/Sidebar"
import Topbar from "../Components/Topbar"
import { supabase } from "../Services/Supabase"

function TeacherStudents() {
  const [teacher, setTeacher] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchTeacherStudents = async () => {
      setLoading(true)
      setError("")

      // Get logged-in teacher
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setError("Unable to identify your account.")
        setLoading(false)
        return
      }

      // Get teacher information
      const { data: teacherData, error: teacherError } =
        await supabase
          .from("teachers")
          .select("*")
          .eq("user_id", user.id)
          .single()

      if (teacherError) {
        console.error(teacherError)
        setError("Unable to load your teacher information.")
        setLoading(false)
        return
      }

      setTeacher(teacherData)

      // Get students in teacher's class
      const { data: studentData, error: studentError } =
        await supabase
          .from("students")
          .select("*")
          .eq("class_name", teacherData.class_name)
          .order("full_name", { ascending: true })

      if (studentError) {
        console.error(studentError)
        setError("Unable to load students.")
        setLoading(false)
        return
      }

      setStudents(studentData || [])
      setLoading(false)
    }

    fetchTeacherStudents()
  }, [])

  return (
    <div className="min-h-screen bg-[#F8F4F0]">

      <Sidebar />

      <div className="ml-64">

        <Topbar />

        <main className="p-6">

          {/* Header */}
          <div className="mb-6">

            <h1 className="text-2xl font-bold text-[#5C3317]">
              My Students
            </h1>

            {teacher && (
              <p className="mt-1 text-sm text-gray-500">
                Students in {teacher.class_name}
              </p>
            )}

          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Student count */}
          {!loading && !error && (
            <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">

              <p className="text-sm text-gray-500">
                Total Students
              </p>

              <p className="mt-1 text-3xl font-bold text-[#5C3317]">
                {students.length}
              </p>

            </div>
          )}

          {/* Students Table */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full text-left text-sm">

                <thead className="bg-[#5C3317] text-white">

                  <tr>
                    <th className="px-5 py-4">
                      Student ID
                    </th>

                    <th className="px-5 py-4">
                      Name
                    </th>

                    <th className="px-5 py-4">
                      Gender
                    </th>

                    <th className="px-5 py-4">
                      Parent/Guardian
                    </th>

                    <th className="px-5 py-4">
                      Phone
                    </th>

                    <th className="px-5 py-4">
                      Status
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {loading ? (

                    <tr>
                      <td
                        colSpan="6"
                        className="px-5 py-10 text-center text-gray-500"
                      >
                        Loading students...
                      </td>
                    </tr>

                  ) : students.length > 0 ? (

                    students.map((student) => (

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

                        <td className="px-5 py-4 text-gray-600">
                          {student.gender}
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

                      </tr>

                    ))

                  ) : (

                    <tr>
                      <td
                        colSpan="6"
                        className="px-5 py-10 text-center text-gray-500"
                      >
                        No students found in your class.
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </main>

      </div>

    </div>
  )
}

export default TeacherStudents