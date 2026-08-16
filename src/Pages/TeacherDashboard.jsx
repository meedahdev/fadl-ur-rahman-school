import { useEffect, useState } from "react"
import { supabase } from "../Services/Supabase"

function TeacherDashboard() {
  const [teacherName, setTeacherName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getTeacherName = async () => {
      // Get the currently logged-in user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      // Get the teacher's profile
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single()

      if (error) {
        console.error("Error getting teacher profile:", error)
      } else {
        setTeacherName(profile.full_name)
      }

      setLoading(false)
    }

    getTeacherName()
  }, [])

  return (
    <div className="min-h-screen bg-[#F8F4F0]">

      <div className="p-8">

        <h1 className="text-3xl font-bold text-[#5C3317]">
          Teacher Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          {loading
            ? "Loading..."
            : `Welcome, ${teacherName}`}
        </p>

      </div>

    </div>
  )
}

export default TeacherDashboard