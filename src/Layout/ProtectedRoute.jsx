import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { supabase } from "../Services/Supabase"

function ProtectedRoute({ children, allowedRoles = [] }) {
  const [session, setSession] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Get logged-in user
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          setSession(null)
          setLoading(false)
          return
        }

        setSession(session)

        // Get user's role from profiles
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()

        if (error) {
          console.error("Profile error:", error)
          setRole(null)
          setLoading(false)
          return
        }

        setRole(profile.role)
      } catch (error) {
        console.error("Authentication error:", error)
      }

      setLoading(false)
    }

    checkUser()
  }, [])

  // Still checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F4F0]">
        <p className="text-[#5C3317]">
          Checking authentication...
        </p>
      </div>
    )
  }

  // Not logged in
  if (!session) {
    return <Navigate to="/" replace />
  }

  // User doesn't have a profile/role
  if (!role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F4F0]">
        <div className="rounded-xl bg-white p-8 text-center shadow-lg">
          <h2 className="text-xl font-bold text-red-600">
            Account Setup Error
          </h2>

          <p className="mt-2 text-gray-600">
            Your account does not have a valid role.
          </p>
        </div>
      </div>
    )
  }

  // Check whether this route allows the user's role
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(role)
  ) {
    // All users go back to the same dashboard
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute