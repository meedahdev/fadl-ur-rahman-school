import { useEffect, useState, useRef } from "react"
import Sidebar from "../Components/Sidebar"
import Topbar from "../Components/Topbar"
import { supabase } from "../Services/Supabase"

function Settings() {
  const [profile, setProfile] = useState(null)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(true)

  // Profile saving
  const [saving, setSaving] = useState(false)

  // Messages
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  // ==============================
  // ANNOUNCEMENTS
  // ==============================
  const [announcements, setAnnouncements] = useState([])
  const [announcementsLoading, setAnnouncementsLoading] = useState(true)

  // New / Edit announcement
  const [announcementTitle, setAnnouncementTitle] = useState("")
  const [announcementMessage, setAnnouncementMessage] = useState("")
  const [announcementType, setAnnouncementType] = useState("Information")
  const [announcementSaving, setAnnouncementSaving] = useState(false)

  // Stores the announcement currently being edited
  const [editingAnnouncementId, setEditingAnnouncementId] = useState(null)

  // Ref for announcement form
  const announcementFormRef = useRef(null)

  // ==============================
  // GET PROFILE
  // ==============================
  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single()

      if (error) {
        console.error(error)
        setError("Unable to load your profile.")
      } else {
        setProfile({
          ...data,
          email: user.email,
        })

        setName(data.full_name || "")
      }

      setLoading(false)
    }

    getProfile()
  }, [])

  // ==============================
  // GET ANNOUNCEMENTS
  // ==============================
  const getAnnouncements = async () => {
    setAnnouncementsLoading(true)

    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error(error)
      setError("Unable to load announcements.")
    } else {
      setAnnouncements(data || [])
    }

    setAnnouncementsLoading(false)
  }

  // Load announcements after profile is loaded
  useEffect(() => {
    if (profile?.role === "admin") {
      getAnnouncements()
    } else if (profile) {
      setAnnouncementsLoading(false)
    }
  }, [profile])

  // ==============================
  // SAVE NAME
  // ==============================
  const handleSave = async (e) => {
    e.preventDefault()

    setMessage("")
    setError("")

    if (!name.trim()) {
      setError("Please enter your name.")
      return
    }

    setSaving(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError("You are not logged in.")
      setSaving(false)
      return
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: name.trim(),
      })
      .eq("id", user.id)

    if (error) {
      console.error(error)
      setError(error.message)
      setSaving(false)
      return
    }

    setProfile({
      ...profile,
      full_name: name.trim(),
    })

    setMessage("Your name has been updated successfully.")
    setSaving(false)
  }

  // ==============================
  // ADD / UPDATE ANNOUNCEMENT
  // ==============================
  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault()

    setMessage("")
    setError("")

    if (!announcementTitle.trim()) {
      setError("Please enter an announcement title.")
      return
    }

    if (!announcementMessage.trim()) {
      setError("Please enter an announcement message.")
      return
    }

    setAnnouncementSaving(true)

    // ==============================
    // UPDATE EXISTING ANNOUNCEMENT
    // ==============================
    if (editingAnnouncementId) {
      const { data, error } = await supabase
        .from("announcements")
        .update({
          title: announcementTitle.trim(),
          message: announcementMessage.trim(),
          type: announcementType,
        })
        .eq("id", editingAnnouncementId)
        .select()
        .single()

      if (error) {
        console.error(error)
        setError(error.message)
        setAnnouncementSaving(false)
        return
      }

      // Update announcement in the current list
      setAnnouncements(
        announcements.map((announcement) =>
          announcement.id === editingAnnouncementId
            ? data
            : announcement
        )
      )

      // Clear edit mode
      setEditingAnnouncementId(null)
      setAnnouncementTitle("")
      setAnnouncementMessage("")
      setAnnouncementType("Information")

      setMessage("Announcement updated successfully.")
      setAnnouncementSaving(false)

      return
    }

    // ==============================
    // ADD NEW ANNOUNCEMENT
    // ==============================
    const { error } = await supabase
      .from("announcements")
      .insert({
        title: announcementTitle.trim(),
        message: announcementMessage.trim(),
        type: announcementType,
      })

    if (error) {
      console.error(error)
      setError(error.message)
      setAnnouncementSaving(false)
      return
    }

    // Clear form
    setAnnouncementTitle("")
    setAnnouncementMessage("")
    setAnnouncementType("Information")

    // Reload announcements
    await getAnnouncements()

    setMessage("Announcement added successfully.")
    setAnnouncementSaving(false)
  }

  // ==============================
  // START EDITING ANNOUNCEMENT
  // ==============================
  const handleEditAnnouncement = (announcement) => {
    setMessage("")
    setError("")

    setEditingAnnouncementId(announcement.id)
    setAnnouncementTitle(announcement.title)
    setAnnouncementMessage(announcement.message)
    setAnnouncementType(announcement.type)

    // Scroll directly to the announcement form
    setTimeout(() => {
      announcementFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 100)
  }

  // ==============================
  // CANCEL EDIT
  // ==============================
  const handleCancelEdit = () => {
    setEditingAnnouncementId(null)
    setAnnouncementTitle("")
    setAnnouncementMessage("")
    setAnnouncementType("Information")

    setMessage("")
    setError("")
  }

  // ==============================
  // DELETE ANNOUNCEMENT
  // ==============================
  const handleDeleteAnnouncement = async (id) => {
    setMessage("")
    setError("")

    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id)

    if (error) {
      console.error(error)
      setError(error.message)
      return
    }

    setAnnouncements(
      announcements.filter(
        (announcement) => announcement.id !== id
      )
    )

    // If deleting the announcement currently being edited
    if (editingAnnouncementId === id) {
      handleCancelEdit()
    }

    setMessage("Announcement deleted successfully.")
  }

  // ==============================
  // LOADING
  // ==============================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F4F0]">
        <p className="text-[#5C3317]">
          Loading settings...
        </p>
      </div>
    )
  }

  // ==============================
  // PAGE
  // ==============================
  return (
    <div className="min-h-screen bg-[#F8F4F0]">

      <Sidebar />

      <div className="ml-64">

        <Topbar />

        <main className="p-6">

          {/* =========================
              PAGE HEADER
          ========================== */}
          <div className="mb-6">

            <h1 className="text-2xl font-bold text-[#5C3317]">
              Settings
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your account information.
            </p>

          </div>

          {/* =========================
              SUCCESS MESSAGE
          ========================== */}
          {message && (
            <div className="mb-5 max-w-2xl rounded-lg bg-green-50 p-4 text-sm text-green-700">
              {message}
            </div>
          )}

          {/* =========================
              ERROR MESSAGE
          ========================== */}
          {error && (
            <div className="mb-5 max-w-2xl rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* =========================
              ACCOUNT INFORMATION
          ========================== */}
          <div className="max-w-2xl rounded-xl bg-white p-6 shadow-sm">

            <h2 className="mb-6 text-lg font-bold text-[#5C3317]">
              Account Information
            </h2>

            <form onSubmit={handleSave}>

              {/* Name */}
              <div className="mb-5">

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-[#D8C4B5] px-4 py-3 outline-none transition focus:border-[#5C3317] focus:ring-2 focus:ring-[#F3E8DC]"
                />

              </div>

              {/* Email */}
              <div className="mb-5">

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-[#D8C4B5] bg-gray-100 px-4 py-3 text-gray-500"
                />

              </div>

              {/* Role */}
              <div className="mb-6">

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Account Role
                </label>

                <span className="inline-block rounded-full bg-[#F3E8DC] px-4 py-2 text-sm font-semibold capitalize text-[#5C3317]">
                  {profile?.role || "Not available"}
                </span>

              </div>

              {/* Save */}
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#5C3317] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#3E210E] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

            </form>

          </div>

          {/* =========================
              SCHOOL ANNOUNCEMENTS
              ADMIN ONLY
          ========================== */}
          {profile?.role === "admin" && (

            <div
              ref={announcementFormRef}
              className="mt-8 max-w-2xl rounded-xl bg-white p-6 shadow-sm"
            >

              <div className="mb-6">

                <h2 className="text-lg font-bold text-[#5C3317]">
                  School Announcements
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add and manage announcements that appear on the dashboard.
                </p>

              </div>

              {/* =========================
                  ADD / EDIT FORM
              ========================== */}
              <form onSubmit={handleAnnouncementSubmit}>

                {/* EDIT MODE MESSAGE */}
                {editingAnnouncementId && (
                  <div className="mb-5 rounded-lg bg-[#F3E8DC] p-4">

                    <p className="text-sm font-semibold text-[#5C3317]">
                      You are editing an announcement.
                    </p>

                    <p className="mt-1 text-xs text-[#8A5A3B]">
                      Make your changes and click Update Announcement.
                    </p>

                  </div>
                )}

                {/* TITLE */}
                <div className="mb-4">

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Announcement Title
                  </label>

                  <input
                    type="text"
                    value={announcementTitle}
                    onChange={(e) =>
                      setAnnouncementTitle(e.target.value)
                    }
                    placeholder="Enter announcement title"
                    className="w-full rounded-lg border border-[#D8C4B5] px-4 py-3 outline-none focus:border-[#5C3317] focus:ring-2 focus:ring-[#F3E8DC]"
                  />

                </div>

                {/* MESSAGE */}
                <div className="mb-4">

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Announcement Message
                  </label>

                  <textarea
                    rows="4"
                    value={announcementMessage}
                    onChange={(e) =>
                      setAnnouncementMessage(e.target.value)
                    }
                    placeholder="Write your announcement..."
                    className="w-full rounded-lg border border-[#D8C4B5] px-4 py-3 outline-none focus:border-[#5C3317] focus:ring-2 focus:ring-[#F3E8DC]"
                  ></textarea>

                </div>

                {/* TYPE */}
                <div className="mb-5">

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Announcement Type
                  </label>

                  <select
                    value={announcementType}
                    onChange={(e) =>
                      setAnnouncementType(e.target.value)
                    }
                    className="w-full rounded-lg border border-[#D8C4B5] px-4 py-3 outline-none focus:border-[#5C3317] focus:ring-2 focus:ring-[#F3E8DC]"
                  >
                    <option>Information</option>
                    <option>Important</option>
                    <option>Parents</option>
                  </select>

                </div>

                {/* BUTTONS */}
                <div className="flex gap-3">

                  <button
                    type="submit"
                    disabled={announcementSaving}
                    className="rounded-lg bg-[#5C3317] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#3E210E] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {announcementSaving
                      ? "Saving..."
                      : editingAnnouncementId
                        ? "Update Announcement"
                        : "Add Announcement"}
                  </button>

                  {editingAnnouncementId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="rounded-lg border border-[#D8C4B5] bg-white px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-[#F8F4F0]"
                    >
                      Cancel
                    </button>
                  )}

                </div>

              </form>

              {/* =========================
                  EXISTING ANNOUNCEMENTS
              ========================== */}
              <div className="mt-8 border-t border-[#E5D5C8] pt-6">

                <h3 className="mb-4 text-lg font-bold text-[#5C3317]">
                  Existing Announcements
                </h3>

                {announcementsLoading ? (

                  <p className="text-sm text-gray-500">
                    Loading announcements...
                  </p>

                ) : announcements.length === 0 ? (

                  <p className="rounded-lg bg-[#F8F4F0] p-4 text-sm text-gray-500">
                    No announcements have been added yet.
                  </p>

                ) : (

                  <div className="space-y-4">

                    {announcements.map((announcement) => (

                      <div
                        key={announcement.id}
                        className="rounded-xl border border-[#E5D5C8] bg-[#F8F4F0] p-5"
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div className="flex-1">

                            <div className="flex items-center gap-3">

                              <h4 className="text-lg font-bold text-[#5C3317]">
                                {announcement.title}
                              </h4>

                              <span className="rounded-full bg-[#F3E8DC] px-3 py-1 text-xs font-semibold text-[#5C3317]">
                                {announcement.type}
                              </span>

                            </div>

                            <p className="mt-2 leading-7 text-gray-600">
                              {announcement.message}
                            </p>

                            {announcement.created_at && (
                              <p className="mt-3 text-xs text-gray-400">
                                {new Date(
                                  announcement.created_at
                                ).toLocaleDateString()}
                              </p>
                            )}

                          </div>

                          {/* ACTION BUTTONS */}
                          <div className="flex shrink-0 gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                handleEditAnnouncement(announcement)
                              }
                              className="rounded-lg bg-[#F3E8DC] px-3 py-2 text-xs font-semibold text-[#5C3317] transition hover:bg-[#E8D5C4]"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteAnnouncement(
                                  announcement.id
                                )
                              }
                              className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                            >
                              Delete
                            </button>

                          </div>

                        </div>

                      </div>

                    ))}

                  </div>

                )}

              </div>

            </div>

          )}

        </main>

      </div>

    </div>
  )
}

export default Settings