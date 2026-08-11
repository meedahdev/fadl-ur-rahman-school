import { useEffect, useState } from "react"
import Sidebar from "../Components/Sidebar"
import Topbar from "../Components/Topbar"
import { supabase } from "../Services/Supabase"

function Results() {
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedStudent, setSelectedStudent] = useState("")

  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingResults, setLoadingResults] = useState(false)
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

  const subjects = [
    "Mathematics",
    "English Language",
    "Basic Science",
  ]

  const emptyScores = {
    Mathematics: {
      ca: "",
      exam: "",
    },

    "English Language": {
      ca: "",
      exam: "",
    },

    "Basic Science": {
      ca: "",
      exam: "",
    },
  }

  const [scores, setScores] = useState(emptyScores)

  // Get grade
  const getGrade = (total) => {
    if (total >= 80) return "A"
    if (total >= 70) return "B"
    if (total >= 60) return "C"
    if (total >= 50) return "D"
    if (total >= 40) return "E"
    return "F"
  }

  // Get remark
  const getRemark = (total) => {
    if (total >= 80) return "Excellent"
    if (total >= 70) return "Very Good"
    if (total >= 60) return "Good"
    if (total >= 50) return "Fair"
    if (total >= 40) return "Pass"
    return "Fail"
  }

  // Fetch students when class changes
  const fetchStudents = async () => {
    if (!selectedClass) {
      setStudents([])
      setSelectedStudent("")
      setScores(emptyScores)
      return
    }

    setLoading(true)
    setError("")
    setMessage("")
    setSelectedStudent("")
    setScores(emptyScores)

    const { data, error } = await supabase
      .from("students")
      .select("id, student_id, full_name, class_name")
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
    setLoading(false)
  }

  useEffect(() => {
    fetchStudents()
  }, [selectedClass])

  // Fetch saved results
  const fetchStudentResults = async () => {
    if (!selectedStudent) {
      setScores(emptyScores)
      return
    }

    setLoadingResults(true)
    setError("")
    setMessage("")

    const { data, error } = await supabase
      .from("results")
      .select("*")
      .eq("student_id", selectedStudent)

    if (error) {
      console.error(error)
      setError(error.message)
      setLoadingResults(false)
      return
    }

    const savedScores = {
      Mathematics: {
        ca: "",
        exam: "",
      },

      "English Language": {
        ca: "",
        exam: "",
      },

      "Basic Science": {
        ca: "",
        exam: "",
      },
    }

    data?.forEach((result) => {
      if (savedScores[result.subject]) {
        savedScores[result.subject] = {
          ca:
            result.test_score !== null
              ? String(result.test_score)
              : "",

          exam:
            result.exam_score !== null
              ? String(result.exam_score)
              : "",
        }
      }
    })

    setScores(savedScores)
    setLoadingResults(false)
  }

  useEffect(() => {
    fetchStudentResults()
  }, [selectedStudent])

  // Handle CA and Exam input
  const handleScoreChange = (subject, type, value) => {
    // Allow only numbers
    if (value !== "" && !/^\d*$/.test(value)) {
      return
    }

    setScores((previousScores) => ({
      ...previousScores,

      [subject]: {
        ...previousScores[subject],
        [type]: value,
      },
    }))

    setMessage("")
    setError("")
  }

  // Save result
  const handleSaveResult = async () => {
    if (!selectedClass) {
      setError("Please select a class.")
      return
    }

    if (!selectedStudent) {
      setError("Please select a student.")
      return
    }

    setSaving(true)
    setError("")
    setMessage("")

    const records = subjects.map((subject) => {
      const caScore = Number(scores[subject].ca) || 0
      const examScore = Number(scores[subject].exam) || 0

      const total = caScore + examScore

      return {
        student_id: selectedStudent,
        subject: subject,
        test_score: caScore,
        exam_score: examScore,
        total: total,
      }
    })

    // Delete old results
    const { error: deleteError } = await supabase
      .from("results")
      .delete()
      .eq("student_id", selectedStudent)

    if (deleteError) {
      console.error(deleteError)
      setError(deleteError.message)
      setSaving(false)
      return
    }

    // Save new results
    const { error: insertError } = await supabase
      .from("results")
      .insert(records)

    if (insertError) {
      console.error(insertError)
      setError(insertError.message)
      setSaving(false)
      return
    }

    setMessage("Student result saved successfully.")
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
              Results
            </h1>

            <p className="mt-1 text-sm text-[#7A5A43]">
              Record and manage student academic results.
            </p>

          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Success */}
          {message && (
            <div className="mb-5 rounded-lg bg-[#F3E8DC] p-4 text-sm font-semibold text-[#5C3317]">
              {message}
            </div>
          )}

          {/* Class and Student */}
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
                    <option
                      key={className}
                      value={className}
                    >
                      {className}
                    </option>
                  ))}

                </select>

              </div>

              {/* Student */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Select Student
                </label>

                <select
                  value={selectedStudent}
                  onChange={(e) =>
                    setSelectedStudent(e.target.value)
                  }
                  disabled={
                    !selectedClass ||
                    students.length === 0
                  }
                  className="w-full rounded-lg border border-[#D8C4B5] bg-white px-4 py-3 outline-none disabled:cursor-not-allowed disabled:bg-gray-100 focus:border-[#5C3317] focus:ring-2 focus:ring-[#F3E8DC]"
                >

                  <option value="">
                    {loading
                      ? "Loading students..."
                      : "Select student"
                    }
                  </option>

                  {students.map((student) => (
                    <option
                      key={student.id}
                      value={student.id}
                    >
                      {student.full_name} ({student.student_id})
                    </option>
                  ))}

                </select>

              </div>

            </div>

          </div>

          {/* Results */}
          {selectedStudent && (

            <div className="rounded-xl bg-white p-6 shadow-sm">

              <div className="mb-6">

                <h2 className="text-xl font-bold text-[#5C3317]">
                  Student Result
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter the CA and Exam scores for each subject.
                </p>

              </div>

              {loadingResults ? (

                <div className="py-10 text-center text-gray-500">
                  Loading student results...
                </div>

              ) : (

                <>

                  <div className="overflow-x-auto">

                    <table className="w-full text-left text-sm">

                      <thead className="bg-[#5C3317] text-white">

                        <tr>

                          <th className="px-5 py-4">
                            Subject
                          </th>

                          <th className="px-5 py-4">
                            CA
                          </th>

                          <th className="px-5 py-4">
                            Exam
                          </th>

                          <th className="px-5 py-4">
                            Total
                          </th>

                          <th className="px-5 py-4">
                            Grade
                          </th>

                          <th className="px-5 py-4">
                            Remark
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {subjects.map((subject) => {

                          const caScore =
                            Number(scores[subject].ca) || 0

                          const examScore =
                            Number(scores[subject].exam) || 0

                          const total =
                            caScore + examScore

                          const grade =
                            getGrade(total)

                          const remark =
                            getRemark(total)

                          return (

                            <tr
                              key={subject}
                              className="border-b border-[#EDE2DA] hover:bg-[#F8F4F0]"
                            >

                              {/* Subject */}
                              <td className="px-5 py-4 font-semibold text-[#5C3317]">
                                {subject}
                              </td>

                              {/* CA */}
                              <td className="px-5 py-4">

                                <input
                                  type="text"
                                  inputMode="numeric"
                                  value={scores[subject].ca}
                                  onChange={(e) =>
                                    handleScoreChange(
                                      subject,
                                      "ca",
                                      e.target.value
                                    )
                                  }
                                  placeholder="CA"
                                  className="w-24 rounded-lg border border-[#D8C4B5] bg-white px-3 py-2 text-center text-gray-800 outline-none focus:border-[#5C3317] focus:ring-2 focus:ring-[#F3E8DC]"
                                />

                              </td>

                              {/* Exam */}
                              <td className="px-5 py-4">

                                <input
                                  type="text"
                                  inputMode="numeric"
                                  value={scores[subject].exam}
                                  onChange={(e) =>
                                    handleScoreChange(
                                      subject,
                                      "exam",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Exam"
                                  className="w-24 rounded-lg border border-[#D8C4B5] bg-white px-3 py-2 text-center text-gray-800 outline-none focus:border-[#5C3317] focus:ring-2 focus:ring-[#F3E8DC]"
                                />

                              </td>

                              {/* Total */}
                              <td className="px-5 py-4">

                                <span className="font-bold text-[#5C3317]">
                                  {total}
                                </span>

                              </td>

                              {/* Grade */}
                              <td className="px-5 py-4">

                                <span className="font-bold text-[#5C3317]">
                                  {grade}
                                </span>

                              </td>

                              {/* Remark */}
                              <td className="px-5 py-4">

                                <span className="font-semibold text-gray-700">
                                  {remark}
                                </span>

                              </td>

                            </tr>

                          )
                        })}

                      </tbody>

                    </table>

                  </div>

                  {/* Save */}
                  <div className="mt-6 flex justify-end">

                    <button
                      onClick={handleSaveResult}
                      disabled={saving}
                      className="rounded-lg bg-[#5C3317] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#3E210E] disabled:cursor-not-allowed disabled:opacity-60"
                    >

                      {saving
                        ? "Saving..."
                        : "Save Result"
                      }

                    </button>

                  </div>

                </>

              )}

            </div>

          )}

          {/* Empty */}
          {!selectedClass && (

            <div className="rounded-xl bg-white px-5 py-12 text-center shadow-sm">

              <h2 className="text-lg font-bold text-[#5C3317]">
                Select a class
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Choose a class above to view students and enter results.
              </p>

            </div>

          )}

        </main>

      </div>

    </div>
  )
}

export default Results

