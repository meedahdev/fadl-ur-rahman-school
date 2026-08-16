import { NavLink, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../Services/Supabase"
import logo from "../Assets/logo.png"

function Sidebar() {
  const navigate = useNavigate()
  const [role, setRole] = useState(null)

  useEffect(() => {
    const getRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (error) {
        console.error(error)
        return
      }

      setRole(profile.role)
    }

    getRole()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  let links = []

  // ADMIN
  if (role === "admin") {
    links = [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: "🏠",
      },
      {
        name: "Students",
        path: "/students",
        icon: "👨‍🎓",
      },
      {
        name: "Teachers",
        path: "/teachers",
        icon: "👩‍🏫",
      },
      {
        name: "Classes",
        path: "/classes",
        icon: "🏫",
      },
      {
        name: "Attendance",
        path: "/attendance",
        icon: "📅",
      },
      {
        name: "Results",
        path: "/results",
        icon: "📚",
      },
      {
        name: "Settings",
        path: "/settings",
        icon: "⚙️",
      },
    ]
  }

  // TEACHER
  if (role === "teacher") {
    links = [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: "🏠",
      },
      {
        name: "Students",
        path: "/students",
        icon: "👨‍🎓",
      },
      {
        name: "Attendance",
        path: "/attendance",
        icon: "📅",
      },
      {
        name: "Results",
        path: "/results",
        icon: "📚",
      },
      {
        name: "Settings",
        path: "/settings",
        icon: "⚙️",
      },
    ]
  }

  // STUDENT
  if (role === "student") {
    links = [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: "🏠",
      },
      {
        name: "Attendance",
        path: "/attendance",
        icon: "📅",
      },
      {
        name: "Results",
        path: "/results",
        icon: "📚",
      },
      {
        name: "Settings",
        path: "/settings",
        icon: "⚙️",
      },
    ]
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-[#5C3317] text-white">

      {/* Logo */}
      <div className="border-b border-[#75451F] p-5">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white">
            <img
              src={logo}
              alt="FADL-UR-RAHMAN Nursery & Primary School Logo"
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <h1 className="text-sm font-bold">
              FADL-UR-RAHMAN
            </h1>

            <p className="text-xs text-[#E8D5C4]">
              School Management
            </p>
          </div>

        </div>

      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-[#E8D5C4]">
          Main Menu
        </p>

        <div className="space-y-1">

          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-white text-[#5C3317]"
                    : "text-[#F5EDE6] hover:bg-[#75451F]"
                }`
              }
            >
              <span className="text-lg">
                {link.icon}
              </span>

              <span>
                {link.name}
              </span>
            </NavLink>
          ))}

        </div>

      </nav>

      {/* Logout */}
      <div className="border-t border-[#75451F] p-4">

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[#F5EDE6] transition hover:bg-red-600 hover:text-white"
        >
          <span className="text-lg">
            🚪
          </span>

          <span>
            Logout
          </span>
        </button>

      </div>

    </aside>
  )
}

export default Sidebar