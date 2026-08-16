import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../Services/Supabase"

function Topbar() {
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getProfile = async () => {
      setLoading(true)

      try {
        // Get the currently logged-in user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          console.error("User error:", userError)
          setLoading(false)
          return
        }

        if (!user) {
          setProfile(null)
          setLoading(false)
          return
        }

        console.log("Logged-in user:", user)

        // Get the user's profile
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", user.id)
          .single()

        if (error) {
          console.error("Profile error:", error)
          setLoading(false)
          return
        }

        console.log("Profile:", data)

        setProfile(data)
      } catch (error) {
        console.error("Error loading profile:", error)
      } finally {
        setLoading(false)
      }
    }

    getProfile()

    // Listen for authentication changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        getProfile()
      }

      if (event === "SIGNED_OUT") {
        setProfile(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("Logout error:", error)
      return
    }

    navigate("/")
  }

  // Get first letter of user's name
  const firstLetter = profile?.full_name
    ? profile.full_name.charAt(0).toUpperCase()
    : "U"

  // Format role
  const formattedRole = profile?.role
    ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
    : "User"

  return (
    <header className="flex h-20 items-center justify-between border-b border-[#E5D5C8] bg-white px-6 shadow-sm">

      {/* Left */}
      <div>
        <h2 className="text-xl font-bold text-[#5C3317]">
          Dashboard
        </h2>

        <p className="text-sm text-gray-500">
          FADL-UR-RAHMAN Nursery & Primary School
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* User Information */}
        <div className="hidden text-right sm:block">

          <p className="text-sm font-semibold text-[#5C3317]">
            {loading
              ? "Loading..."
              : profile?.full_name || "User"}
          </p>

          <p className="text-xs text-gray-500">
            {formattedRole}
          </p>

        </div>

        {/* Avatar */}
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5C3317] font-bold text-white">
          {firstLetter}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="rounded-lg border border-[#D8C4B5] px-4 py-2 text-sm font-semibold text-[#5C3317] transition hover:bg-[#F8F4F0]"
        >
          Logout
        </button>

      </div>

    </header>
  )
}

export default Topbar