import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../Services/Supabase"

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()

    setError("")

    if (!email || !password) {
      setError("Please enter your email and password.")
      return
    }

    setLoading(true)

    try {
      // Login with Supabase Authentication
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        })

      if (loginError) {
        setError(loginError.message)
        setLoading(false)
        return
      }

      // Get logged-in user's profile
      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("id, full_name, role")
          .eq("id", data.user.id)
          .single()

      if (profileError) {
        console.error("Profile error:", profileError)

        // Sign the user out if their profile cannot be found
        await supabase.auth.signOut()

        setError("Unable to load your account information.")
        setLoading(false)
        return
      }

      // Admin, Teacher, and Student all use the same Dashboard
      if (
        profile.role === "admin" ||
        profile.role === "teacher" ||
        profile.role === "student"
      ) {
        navigate("/dashboard")
      } else {
        await supabase.auth.signOut()
        setError("Your account does not have a valid role.")
      }

    } catch (error) {
      console.error("Login error:", error)
      setError("Something went wrong. Please try again.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#F8F4F0] flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* School Header */}
        <div className="mb-8 text-center">

          <h1 className="text-3xl font-extrabold uppercase tracking-wide text-[#5C3317]">
            FADL-UR-RAHMAN
          </h1>

          <h2 className="mt-1 font-bold uppercase text-gray-700">
            Nursery & Primary School
          </h2>

          <p className="mt-2 text-sm text-[#7A5A43]">
            Knowledge, Integrity & Power
          </p>

        </div>

        {/* Login Card */}
        <div className="rounded-2xl bg-white p-8 shadow-lg">

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-[#5C3317]">
              Welcome Back
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Login to access your school account.
            </p>

          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>

            {/* Email */}
            <div className="mb-5">

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-lg border border-[#D8C4B5] px-4 py-3 outline-none transition focus:border-[#5C3317] focus:ring-2 focus:ring-[#F3E8DC]"
              />

            </div>

            {/* Password */}
            <div className="mb-6">

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-[#D8C4B5] px-4 py-3 outline-none transition focus:border-[#5C3317] focus:ring-2 focus:ring-[#F3E8DC]"
              />

            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#5C3317] px-5 py-3 font-semibold text-white transition hover:bg-[#3E210E] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Fadl-Ur-Rahman Nursery & Primary School
        </p>

      </div>

    </div>
  )
}

export default Login