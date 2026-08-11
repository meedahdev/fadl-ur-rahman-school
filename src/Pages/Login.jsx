import { useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../Assets/logo.png"
import { supabase } from "../Services/Supabase"

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
    <div className="flex min-h-screen items-center justify-center bg-[#F8F4F0] px-4 py-8">

      <div className="w-full max-w-md rounded-2xl border border-[#E5D5C8] bg-white p-8 shadow-lg">

        {/* School Header */}
        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#F3E8DC] bg-white">
            <img
              src={logo}
              alt="FADL-UR-RAHMAN Nursery & Primary School Logo"
              className="h-full w-full object-contain"
            />
          </div>

          <h1 className="text-2xl font-bold text-[#5C3317]">
            FADL-UR-RAHMAN
          </h1>

          <p className="text-sm text-gray-500">
            Nursery & Primary School
          </p>

        </div>

        {/* Login Header */}
        <div className="mb-6">

          <h2 className="mb-2 text-2xl font-semibold text-[#3E210E]">
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

            <label className="mb-2 block text-sm font-semibold text-[#3E210E]">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[#D8C4B5] px-4 py-3 text-sm outline-none transition focus:border-[#5C3317] focus:ring-2 focus:ring-[#F3E8DC]"
            />

          </div>

          {/* Password */}
          <div className="mb-5">

            <label className="mb-2 block text-sm font-semibold text-[#3E210E]">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[#D8C4B5] px-4 py-3 text-sm outline-none transition focus:border-[#5C3317] focus:ring-2 focus:ring-[#F3E8DC]"
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
            className="w-full rounded-lg bg-[#5C3317] py-3 font-semibold text-white transition hover:bg-[#3E210E] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>

    </div>
  )
}

export default Login