import { useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../../Assets/logo.png"
import { supabase } from "../../Services/Supabase"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    setError("")

    if (!email || !password) {
      setError("Please enter your email and password.")
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    console.log("Login successful:", data)

    navigate("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">

      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">

        {/* School Header */}
        <div className="mb-8 text-center">

          <img
            src={logo}
            alt="FADL-UR-RAHMAN Nursery & Primary School Logo"
            className="mx-auto mb-3 h-24 w-24 rounded-full object-contain"
          />

          <h1 className="text-2xl font-bold text-blue-900">
            FADL-UR-RAHMAN
          </h1>

          <p className="text-sm text-gray-500">
            Nursery & Primary School
          </p>

        </div>

        {/* Login Header */}
        <div className="mb-6">

          <h2 className="mb-2 text-2xl font-semibold text-gray-800">
            Welcome Back
          </h2>

          <p className="text-sm text-gray-500">
            Login to access the school management system
          </p>

        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>

          {/* Email */}
          <div className="mb-5">

            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* Password */}
          <div className="mb-5">

            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* Error */}
          {error && (
            <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-900 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>

    </div>
  )
}

export default Login