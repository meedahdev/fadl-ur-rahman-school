import { useNavigate } from "react-router-dom"
import { supabase } from "../Services/Supabase"

function Topbar() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  return (
    <header className="flex h-20 items-center justify-between border-b border-[#E5D5C8] bg-white px-6 shadow-sm">

      <div>
        <h2 className="text-xl font-bold text-[#5C3317]">
          Dashboard
        </h2>

        <p className="text-sm text-gray-500">
          FADL-UR-RAHMAN Nursery & Primary School
        </p>
      </div>

      <div className="flex items-center gap-4">

        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-[#5C3317]">
            Administrator
          </p>

          <p className="text-xs text-gray-500">
            School Admin
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5C3317] font-bold text-white">
          A
        </div>

      </div>

    </header>
  )
}

export default Topbar