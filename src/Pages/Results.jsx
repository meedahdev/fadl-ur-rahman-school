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

  const subjectGroups = [
    {
      group: "ENGLISH STUDIES",
      subjects: [
        "Grammar",
        "Diction",
        "Verbal",
      ],
    },
    {
      group: "MATHEMATICS",
      subjects: [
        "Mathematics",
        "Quant. Reasoning",
      ],
    },
    {
      group: "BASIC SCIENCE / TECHNOLOGY",
      subjects: [
        "ICT",
        "Basic Science",
      ],
    },
    {
      group: "NATIONAL VALUE",
      subjects: [
        "Civic Education",
        "Security Education",
        "Social Studies",
        "History",
      ],
    },
    {
      group: "PRE-VOCATIONAL STUDIES",
      subjects: [
        "Agric Science",
        "Home Economics",
      ],
    },
    {
      group: "CREATIVE & CULTURAL ARTS",
      subjects: [
        "Music",
        "Hand Writing",
        "Vocational Edu",
      ],
    },
    {
      group: "LANGUAGE",
      subjects: [
        "CRK/IRK",
        "Yoruba",
      ],
    },
    {
      group: "FOREIGN LANGUAGE",
      subjects: [
        "Arabic",
        "Qur'an Memorization",
        "French",
      ],
    },
  ]

  const subjects = subjectGroups.flatMap(
    (group) => group.subjects
  )

  const personalItems = [
    "Obedience",
    "Honesty",
    "Self Control",
    "Self Reliance",
    "Initiative",
    "Responsibility",
    "Punctuality",
    "Neatness",
    "Perseverance",
    "Attentiveness",
    "Attendance",
  ]

  const socialItems = [
    "Politeness",
    "Consideration",
    "Sociability",
    "Promptness",
    "Sense of Value",
  ]

  const psychomotorItems = [
    "Handwriting",
    "Communicating",
    "Sport & Games",
    "Manual Skills",
    "Dexterity",
  ]

  const createEmptyScores = () => {
    const result = {}

    subjects.forEach((subject) => {
      result[subject] = {
        ca: "",
        exam: "",
      }
    })

    return result
  }

  const createEmptyRatings = (items) => {
    const result = {}

    items.forEach((item) => {
      result[item] = ""
    })

    return result
  }

  const [scores, setScores] = useState(createEmptyScores())

  const [studentInfo, setStudentInfo] = useState({
    dateOfBirth: "",
    termSession: "",
    daysOpened: "",
    daysPresent: "",
    daysAbsent: "",
    termBegan: "",
    termEnded: "",
    nextTermBegins: "",
  })

  const [attendanceLoading, setAttendanceLoading] = useState(false)

  const [personalRatings, setPersonalRatings] = useState(
    createEmptyRatings(personalItems)
  )

  const [socialRatings, setSocialRatings] = useState(
    createEmptyRatings(socialItems)
  )

  const [psychomotorRatings, setPsychomotorRatings] = useState(
    createEmptyRatings(psychomotorItems)
  )

  const [clubData, setClubData] = useState({
    organization: "",
    officeHeld: "",
    contribution: "",
  })

  const [comments, setComments] = useState({
    classTeacher: "",
    headTeacher: "",
  })

  // Fetch students
  const fetchStudents = async () => {
    if (!selectedClass) {
      setStudents([])
      setSelectedStudent("")
      return
    }

    setLoading(true)
    setError("")
    setMessage("")
    setSelectedStudent("")

    const { data, error } = await supabase
      .from("students")
      .select(
        "id, student_id, full_name, gender, date_of_birth, class_name"
      )
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

  // Reset report
  const resetReport = () => {
    setScores(createEmptyScores())

    setStudentInfo({
      dateOfBirth: "",
      termSession: "",
      daysOpened: "",
      daysPresent: "",
      daysAbsent: "",
      termBegan: "",
      termEnded: "",
      nextTermBegins: "",
    })

    setPersonalRatings(createEmptyRatings(personalItems))
    setSocialRatings(createEmptyRatings(socialItems))
    setPsychomotorRatings(createEmptyRatings(psychomotorItems))

    setClubData({
      organization: "",
      officeHeld: "",
      contribution: "",
    })

    setComments({
      classTeacher: "",
      headTeacher: "",
    })
  }

  // When student changes
  useEffect(() => {
    if (!selectedStudent) {
      resetReport()
      return
    }

    const student = students.find(
      (item) => item.id === selectedStudent
    )

    if (student) {
      setStudentInfo((previous) => ({
        ...previous,
        dateOfBirth: student.date_of_birth || "",
      }))
    }

    fetchStudentResults()
  }, [selectedStudent])

  // Fetch saved results
  const fetchStudentResults = async () => {
    if (!selectedStudent) {
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

    const savedScores = createEmptyScores()

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
  // Fetch student attendance
  const fetchStudentAttendance = async () => {
    if (!selectedStudent) {
      return
    }

    setAttendanceLoading(true)

    const { data, error } = await supabase
      .from("attendance")
      .select("attendance_date, status")
      .eq("student_id", selectedStudent)

    if (error) {
      console.error(error)
      setError(error.message)
      setAttendanceLoading(false)
      return
    }

    const attendanceRecords = data || []

    const daysOpened = attendanceRecords.length

    const daysPresent = attendanceRecords.filter(
      (record) => record.status === "Present"
    ).length

    const daysAbsent = attendanceRecords.filter(
      (record) => record.status === "Absent"
    ).length

    setStudentInfo((previous) => ({
      ...previous,
      daysOpened: String(daysOpened),
      daysPresent: String(daysPresent),
      daysAbsent: String(daysAbsent),
    }))

    setAttendanceLoading(false)
  }

  // Score input
  const handleScoreChange = (
    subject,
    type,
    value
  ) => {
    if (value === "") {
      setScores((previous) => ({
        ...previous,
        [subject]: {
          ...previous[subject],
          [type]: "",
        },
      }))

      return
    }

    const numberValue = Number(value)

    if (type === "ca" && numberValue > 40) {
      return
    }

    if (type === "exam" && numberValue > 60) {
      return
    }

    setScores((previous) => ({
      ...previous,
      [subject]: {
        ...previous[subject],
        [type]: value,
      },
    }))
  }

  // Grade
  const getGrade = (total) => {
    if (total >= 80) return "A"
    if (total >= 70) return "B"
    if (total >= 60) return "C"
    if (total >= 50) return "D"
    if (total >= 40) return "E"
    return "F"
  }

  // Remark
  const getRemark = (total) => {
    if (total >= 80) return "Excellent"
    if (total >= 70) return "Very Good"
    if (total >= 60) return "Good"
    if (total >= 50) return "Fair"
    if (total >= 40) return "Pass"
    return "Poor"
  }

  // Subject total
  const getSubjectTotal = (subject) => {
    const ca = Number(scores[subject]?.ca) || 0
    const exam = Number(scores[subject]?.exam) || 0

    return ca + exam
  }

  const enteredSubjects = subjects.filter(
    (subject) =>
      scores[subject]?.ca !== "" ||
      scores[subject]?.exam !== ""
  ).length

  const totalMarks = subjects.reduce(
    (total, subject) => {
      return total + getSubjectTotal(subject)
    },
    0
  )

  const totalMarkObtainable =
    enteredSubjects * 100

  const average =
    enteredSubjects > 0
      ? (totalMarks / enteredSubjects).toFixed(1)
      : "0.0"

  // Rating change
  const handleRatingChange = (
    setter,
    item,
    value
  ) => {
    setter((previous) => ({
      ...previous,
      [item]: value,
    }))
  }

  // Student info
  const handleStudentInfoChange = (e) => {
    setStudentInfo({
      ...studentInfo,
      [e.target.name]: e.target.value,
    })
  }

  // Club
  const handleClubChange = (e) => {
    setClubData({
      ...clubData,
      [e.target.name]: e.target.value,
    })
  }

  // Comments
  const handleCommentChange = (e) => {
    setComments({
      ...comments,
      [e.target.name]: e.target.value,
    })
  }

  // Save
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

    const records = subjects
      .filter(
        (subject) =>
          scores[subject].ca !== "" ||
          scores[subject].exam !== ""
      )
      .map((subject) => {
        const ca = Number(scores[subject].ca) || 0
        const exam = Number(scores[subject].exam) || 0

        return {
          student_id: selectedStudent,
          subject: subject,
          test_score: ca,
          exam_score: exam,
          total: ca + exam,
        }
      })

    if (records.length === 0) {
      setError(
        "Please enter at least one subject score."
      )
      setSaving(false)
      return
    }

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

    const { error: insertError } = await supabase
      .from("results")
      .insert(records)

    if (insertError) {
      console.error(insertError)
      setError(insertError.message)
      setSaving(false)
      return
    }

    setMessage(
      "Student result saved successfully."
    )

    setSaving(false)
  }

  const selectedStudentData = students.find(
    (student) => student.id === selectedStudent
  )
  const removeNumberArrows =
    "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"

  return (
    <div className="min-h-screen bg-[#F8F4F0]">

      <Sidebar />

      <div className="ml-64">

        <Topbar />

        <main className="p-6">

          {/* Page Header */}
          <div className="mb-6">

            <h1 className="text-2xl font-bold text-[#5C3317]">
              Results
            </h1>

            <p className="mt-1 text-sm text-[#7A5A43]">
              Create and manage student report sheets.
            </p>

          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Message */}
          {message && (
            <div className="mb-5 rounded-lg bg-green-50 p-4 text-sm font-semibold text-green-700">
              {message}
            </div>
          )}

          {/* Selection */}
          <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">

            <div className="grid gap-5 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Select Class
                </label>

                <select
                  value={selectedClass}
                  onChange={(e) =>
                    setSelectedClass(e.target.value)
                  }
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
                  className="w-full rounded-lg border border-[#D8C4B5] bg-white px-4 py-3 outline-none disabled:bg-gray-100"
                >

                  <option value="">
                    {loading
                      ? "Loading students..."
                      : "Select student"}
                  </option>

                  {students.map((student) => (
                    <option
                      key={student.id}
                      value={student.id}
                    >
                      {student.full_name} (
                      {student.student_id})
                    </option>
                  ))}

                </select>

              </div>

            </div>

          </div>

          {/* REPORT SHEET */}
          {selectedStudent && (

            <div className="print-report overflow-hidden rounded-xl bg-white shadow-lg">

              {loadingResults ? (

                <div className="py-10 text-center text-gray-500">
                  Loading student report...
                </div>

              ) : (

                <>

                  {/* SCHOOL HEADER */}
                  <div className="border-b-4 border-[#5C3317] p-6 text-center">

                    <h1 className="text-3xl font-extrabold uppercase tracking-wide text-[#5C3317]">
                      FADL-UR-RAHMAN
                    </h1>

                    <h2 className="font-bold uppercase text-gray-700">
                      NURSERY & PRIMARY SCHOOL
                    </h2>

                    <p className="text-sm font-semibold text-gray-500">
                      Motto: Knowledge, Integrity & Power
                    </p>

                    <div className="mt-4">
                      <h3 className="text-xl font-extrabold underline">
                        REPORT SHEET
                      </h3>
                    </div>

                  </div>

                  {/* STUDENT DATA + ATTENDANCE */}
                  <div className="grid gap-6 p-6 lg:grid-cols-2">

                    {/* Student Data */}
                    <div>

                      <h3 className="mb-3 text-center font-bold uppercase text-[#5C3317]">
                        Student's Data
                      </h3>

                      <div className="overflow-hidden rounded-lg border border-[#D8C4B5]">

                        <div className="grid grid-cols-2 border-b border-[#D8C4B5]">
                          <div className="bg-[#F3E8DC] p-3 text-xs font-bold">
                            NAME OF STUDENT
                          </div>

                          <div className="p-3 font-semibold">
                            {selectedStudentData?.full_name}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 border-b border-[#D8C4B5]">
                          <div className="bg-[#F3E8DC] p-3 text-xs font-bold">
                            DATE OF BIRTH
                          </div>

                          <div className="p-2">
                            <input
                              type="date"
                              name="dateOfBirth"
                              value={
                                studentInfo.dateOfBirth
                              }
                              onChange={
                                handleStudentInfoChange
                              }
                              className="w-full rounded border border-[#D8C4B5] px-2 py-1 text-sm"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 border-b border-[#D8C4B5]">
                          <div className="bg-[#F3E8DC] p-3 text-xs font-bold">
                            CLASS
                          </div>

                          <div className="p-3 font-semibold">
                            {selectedClass}
                          </div>
                        </div>

                        <div className="grid grid-cols-2">
                          <div className="bg-[#F3E8DC] p-3 text-xs font-bold">
                            TERM / SESSION
                          </div>

                          <div className="p-2">
                            <input
                              type="text"
                              name="termSession"
                              value={
                                studentInfo.termSession
                              }
                              onChange={
                                handleStudentInfoChange
                              }
                              placeholder="e.g. 3rd Term 2026/2027"
                              className="w-full rounded border border-[#D8C4B5] px-2 py-2 text-sm"
                            />
                          </div>
                        </div>

                      </div>

                    </div>

                    {/* Attendance */}
                    <div>

                      <h3 className="mb-3 text-center font-bold uppercase text-[#5C3317]">
                        Attendance
                      </h3>

                      <div className="grid grid-cols-3 gap-2">

                        <div className="rounded border border-[#D8C4B5] p-3 text-center">

                          <p className="text-[10px] font-bold">
                            DAYS OPENED
                          </p>

                          <input
                            type="number"
                            name="daysOpened"
                            value={studentInfo.daysOpened}
                            onChange={handleStudentInfoChange}
                            readOnly
                            className={`mt-2 w-full rounded border border-[#D8C4B5] px-2 py-2 text-center bg-gray-50 ${removeNumberArrows}`}
                          />

                        </div>

                        <div className="rounded border border-[#D8C4B5] p-3 text-center">

                          <p className="text-[10px] font-bold">
                            DAYS PRESENT
                          </p>

                          <input
                            type="number"
                            name="daysPresent"
                            value={studentInfo.daysPresent}
                            onChange={handleStudentInfoChange}
                            readOnly
                            className={`mt-2 w-full rounded border border-[#D8C4B5] px-2 py-2 text-center bg-gray-50 ${removeNumberArrows}`}
                          />

                        </div>

                        <div className="rounded border border-[#D8C4B5] p-3 text-center">

                          <p className="text-[10px] font-bold">
                            DAYS ABSENT
                          </p>

                          <input
                            type="number"
                            name="daysAbsent"
                            value={studentInfo.daysAbsent}
                            onChange={handleStudentInfoChange}
                            className={`mt-2 w-full rounded border border-[#D8C4B5] px-2 py-2 text-center ${removeNumberArrows}`}
                          />

                        </div>

                      </div>

                      <div className="mt-3 grid gap-3">

                        <div className="grid grid-cols-2 gap-2">

                          <div>
                            <label className="text-xs font-bold">
                              TERM BEGAN
                            </label>

                            <input
                              type="date"
                              name="termBegan"
                              value={
                                studentInfo.termBegan
                              }
                              onChange={
                                handleStudentInfoChange
                              }
                              className="mt-1 w-full rounded border border-[#D8C4B5] px-2 py-2"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold">
                              TERM ENDED
                            </label>

                            <input
                              type="date"
                              name="termEnded"
                              value={
                                studentInfo.termEnded
                              }
                              onChange={
                                handleStudentInfoChange
                              }
                              className="mt-1 w-full rounded border border-[#D8C4B5] px-2 py-2"
                            />
                          </div>

                        </div>

                        <div>
                          <label className="text-xs font-bold">
                            NEXT TERM BEGINS
                          </label>

                          <input
                            type="date"
                            name="nextTermBegins"
                            value={
                              studentInfo.nextTermBegins
                            }
                            onChange={
                              handleStudentInfoChange
                            }
                            className="mt-1 w-full rounded border border-[#D8C4B5] px-2 py-2"
                          />
                        </div>

                      </div>

                    </div>

                  </div>

                  {/* COGNITIVE ABILITY */}
                  <div className="px-6">

                    <h2 className="mb-3 text-center text-lg font-extrabold uppercase text-[#5C3317]">
                      Cognitive Ability
                    </h2>

                    <div className="overflow-x-auto">

                      <table className="w-full border-collapse text-sm">

                        <thead>

                          <tr className="bg-[#5C3317] text-white">

                            <th className="border px-3 py-3 text-left">
                              SUBJECTS
                            </th>

                            <th className="border px-3 py-3">
                              CA
                            </th>

                            <th className="border px-3 py-3">
                              EXAM
                            </th>

                            <th className="border px-3 py-3">
                              TOTAL
                            </th>

                            <th className="border px-3 py-3">
                              GRADE
                            </th>

                            <th className="border px-3 py-3">
                              REMARK
                            </th>

                          </tr>

                        </thead>

                        <tbody>

                          {subjectGroups.map(
                            (group) =>
                              group.subjects.map(
                                (subject, index) => {

                                  const total =
                                    getSubjectTotal(
                                      subject
                                    )

                                  const hasScore =
                                    scores[subject]
                                      .ca !== "" ||
                                    scores[subject]
                                      .exam !== ""

                                  return (
                                    <tr
                                      key={subject}
                                      className="hover:bg-[#F8F4F0]"
                                    >

                                      <td className="border border-[#D8C4B5] px-3 py-2">

                                        {index === 0 && (
                                          <div className="text-[9px] font-bold uppercase text-[#7A5A43]">
                                            {group.group}
                                          </div>
                                        )}

                                        {subject}

                                      </td>
                                      <td className="border border-[#D8C4B5] p-1">
                                        <input
                                          type="number"
                                          min="0"
                                          max="40"
                                          value={scores[subject].ca}
                                          onChange={(e) =>
                                            handleScoreChange(
                                              subject,
                                              "ca",
                                              e.target.value
                                            )
                                          }
                                          className={`w-full rounded border border-[#D8C4B5] px-2 py-2 text-center outline-none focus:border-[#5C3317] ${removeNumberArrows}`}
                                        />
                                      </td>

                                      <td className="border border-[#D8C4B5] p-1">

                                        <input
                                          type="number"
                                          min="0"
                                          max="60"
                                          value={scores[subject].exam}
                                          onChange={(e) =>
                                            handleScoreChange(
                                              subject,
                                              "exam",
                                              e.target.value
                                            )
                                          }
                                          className={`w-full rounded border border-[#D8C4B5] px-2 py-2 text-center outline-none focus:border-[#5C3317] ${removeNumberArrows}`}
                                        />

                                      </td>

                                      <td className="border border-[#D8C4B5] text-center font-bold text-[#5C3317]">
                                        {hasScore
                                          ? total
                                          : ""}
                                      </td>

                                      <td className="border border-[#D8C4B5] text-center font-bold">
                                        {hasScore
                                          ? getGrade(total)
                                          : ""}
                                      </td>

                                      <td className="border border-[#D8C4B5] px-2">
                                        {hasScore
                                          ? getRemark(total)
                                          : ""}
                                      </td>

                                    </tr>
                                  )
                                }
                              )
                          )}

                        </tbody>

                      </table>

                    </div>

                  </div>

                  {/* TOTALS */}
                  <div className="grid gap-4 p-6 md:grid-cols-3">

                    <div className="rounded-lg border border-[#D8C4B5] p-4">

                      <p className="text-xs font-bold uppercase text-gray-500">
                        Total Mark Obtainable
                      </p>

                      <p className="mt-2 text-xl font-bold text-[#5C3317]">
                        {totalMarkObtainable}
                      </p>

                    </div>

                    <div className="rounded-lg border border-[#D8C4B5] p-4">

                      <p className="text-xs font-bold uppercase text-gray-500">
                        Total Mark Obtain
                      </p>

                      <p className="mt-2 text-xl font-bold text-[#5C3317]">
                        {totalMarks}
                      </p>

                    </div>

                    <div className="rounded-lg border border-[#D8C4B5] p-4">

                      <p className="text-xs font-bold uppercase text-gray-500">
                        Average
                      </p>

                      <p className="mt-2 text-xl font-bold text-[#5C3317]">
                        {average}
                      </p>

                    </div>

                  </div>

                  {/* PERSONAL + SOCIAL + PSYCHOMOTOR */}
                  <div className="grid gap-6 px-6 lg:grid-cols-3">

                    {/* Personal */}
                    <RatingSection
                      title="Personal Development"
                      items={personalItems}
                      ratings={personalRatings}
                      setRatings={setPersonalRatings}
                    />

                    {/* Social */}
                    <RatingSection
                      title="Social Development"
                      items={socialItems}
                      ratings={socialRatings}
                      setRatings={setSocialRatings}
                    />

                    {/* Psychomotor */}
                    <RatingSection
                      title="Psychomotor"
                      items={psychomotorItems}
                      ratings={psychomotorRatings}
                      setRatings={setPsychomotorRatings}
                    />

                  </div>

                  {/* Grade Scale */}
                  <div className="p-6">

                    <h2 className="mb-3 font-bold uppercase text-[#5C3317]">
                      Grade Scale
                    </h2>

                    <div className="grid grid-cols-2 gap-2 md:grid-cols-5">

                      <GradeBox
                        grade="A"
                        range="80 - 100"
                        remark="Excellent"
                      />

                      <GradeBox
                        grade="B"
                        range="70 - 79"
                        remark="Very Good"
                      />

                      <GradeBox
                        grade="C"
                        range="60 - 69"
                        remark="Good"
                      />

                      <GradeBox
                        grade="D"
                        range="50 - 59"
                        remark="Fair"
                      />

                      <GradeBox
                        grade="E/F"
                        range="0 - 49"
                        remark="Poor"
                      />

                    </div>

                  </div>

                  {/* SPORTS / CLUB */}
                  <div className="p-6">

                    <h2 className="mb-3 font-bold uppercase text-[#5C3317]">
                      Sports / Clubs / Youth Organization E.T.C
                    </h2>

                    <div className="overflow-x-auto">

                      <table className="w-full border-collapse text-sm">

                        <thead>

                          <tr className="bg-[#5C3317] text-white">

                            <th className="border px-3 py-3">
                              Organization
                            </th>

                            <th className="border px-3 py-3">
                              Office Held
                            </th>

                            <th className="border px-3 py-3">
                              Significant Contribution
                            </th>

                          </tr>

                        </thead>

                        <tbody>

                          <tr>

                            <td className="border border-[#D8C4B5] p-2">

                              <input
                                type="text"
                                name="organization"
                                value={
                                  clubData.organization
                                }
                                onChange={handleClubChange}
                                className="w-full rounded border border-[#D8C4B5] px-3 py-2"
                              />

                            </td>

                            <td className="border border-[#D8C4B5] p-2">

                              <input
                                type="text"
                                name="officeHeld"
                                value={
                                  clubData.officeHeld
                                }
                                onChange={handleClubChange}
                                className="w-full rounded border border-[#D8C4B5] px-3 py-2"
                              />

                            </td>

                            <td className="border border-[#D8C4B5] p-2">

                              <input
                                type="text"
                                name="contribution"
                                value={
                                  clubData.contribution
                                }
                                onChange={handleClubChange}
                                className="w-full rounded border border-[#D8C4B5] px-3 py-2"
                              />

                            </td>

                          </tr>

                        </tbody>

                      </table>

                    </div>

                  </div>

                  {/* COMMENTS */}
                  <div className="grid gap-6 p-6 md:grid-cols-2">

                    <div>

                      <label className="mb-2 block font-bold text-[#5C3317]">
                        Class Teacher's Comment
                      </label>

                      <textarea
                        name="classTeacher"
                        value={comments.classTeacher}
                        onChange={handleCommentChange}
                        rows="5"
                        placeholder="Enter class teacher's comment..."
                        className="w-full rounded-lg border border-[#D8C4B5] px-4 py-3 outline-none focus:border-[#5C3317]"
                      />

                    </div>

                    <div>

                      <label className="mb-2 block font-bold text-[#5C3317]">
                        Head Teacher's Comment
                      </label>

                      <textarea
                        name="headTeacher"
                        value={comments.headTeacher}
                        onChange={handleCommentChange}
                        rows="5"
                        placeholder="Enter head teacher's comment..."
                        className="w-full rounded-lg border border-[#D8C4B5] px-4 py-3 outline-none focus:border-[#5C3317]"
                      />

                    </div>

                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="no-print flex justify-end gap-3 border-t border-[#EDE2DA] p-6">

                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="rounded-lg border border-[#5C3317] px-6 py-3 text-sm font-semibold text-[#5C3317] transition hover:bg-[#F3E8DC]"
                    >
                      Print Result
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveResult}
                      disabled={saving}
                      className="rounded-lg bg-[#5C3317] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#3E210E] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Save Result"}
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
                Choose a class above to create a student report.
              </p>

            </div>

          )}

        </main>

      </div>

    </div>
  )
}

/* Rating Section */
function RatingSection({
  title,
  items,
  ratings,
  setRatings,
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#D8C4B5]">

      <div className="bg-[#5C3317] px-4 py-3 text-center font-bold uppercase text-white">
        {title}
      </div>

      <div className="grid grid-cols-[1fr_repeat(5,30px)] bg-[#F3E8DC] text-center text-[10px] font-bold">

        <div className="p-2 text-left">
          ITEM
        </div>

        <div className="p-2">5</div>
        <div className="p-2">4</div>
        <div className="p-2">3</div>
        <div className="p-2">2</div>
        <div className="p-2">1</div>

      </div>

      {items.map((item) => (

        <div
          key={item}
          className="grid grid-cols-[1fr_repeat(5,30px)] items-center border-t border-[#D8C4B5] text-xs"
        >

          <div className="px-2 py-3">
            {item}
          </div>

          {[5, 4, 3, 2, 1].map((number) => (

            <div
              key={number}
              className="flex justify-center"
            >

              <input
                type="radio"
                name={`${title}-${item}`}
                checked={
                  ratings[item] === String(number)
                }
                onChange={() =>
                  setRatings((previous) => ({
                    ...previous,
                    [item]: String(number),
                  }))
                }
              />

            </div>

          ))}

        </div>

      ))}

    </div>
  )
}

/* Grade Box */
function GradeBox({
  grade,
  range,
  remark,
}) {
  return (
    <div className="rounded-lg border border-[#D8C4B5] p-3 text-center">

      <p className="text-lg font-extrabold text-[#5C3317]">
        {grade}
      </p>

      <p className="text-xs font-semibold">
        {range}
      </p>

      <p className="text-xs text-gray-500">
        {remark}
      </p>

    </div>
  )
}

export default Results