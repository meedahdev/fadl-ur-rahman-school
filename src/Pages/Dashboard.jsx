import { useEffect, useState } from "react"
import Sidebar from "../Components/Sidebar"
import Topbar from "../Components/Topbar"
import { supabase } from "../Services/Supabase"

import school1 from "../Assets/SchoolImages/school1.jpeg"
import school2 from "../Assets/SchoolImages/school2.jpeg"
import school3 from "../Assets/SchoolImages/school3.jpeg"
import school4 from "../Assets/SchoolImages/school4.jpeg"

function Dashboard() {
  const images = [school1, school2, school3, school4]

  const [currentImage, setCurrentImage] = useState(0)

  // Announcements
  const [announcements, setAnnouncements] = useState([])
  const [announcementsLoading, setAnnouncementsLoading] = useState(true)

  // Automatically change image every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [images.length])

  // Load announcements from Supabase
  useEffect(() => {
    const getAnnouncements = async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading announcements:", error)
        setAnnouncementsLoading(false)
        return
      }

      setAnnouncements(data || [])
      setAnnouncementsLoading(false)
    }

    getAnnouncements()
  }, [])

  return (
    <div className="min-h-screen bg-[#F8F4F0]">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64">

        {/* Topbar */}
        <Topbar />

        <main className="p-6">

          {/* Moving School Images */}
          <section className="relative h-[420px] overflow-hidden rounded-2xl shadow-lg">

            {images.map((image, index) => (
              <img
                key={image}
                src={image}
                alt="FADL-UR-RAHMAN Nur & Pry School"
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                  currentImage === index
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              />
            ))}

            {/* Image Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Welcome Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">

              <p className="mb-3 text-sm font-semibold uppercase tracking-[3px]">
                FADL-UR-RAHMAN
              </p>

              <h1 className="text-3xl font-bold md:text-5xl">
                Welcome to FADL-UR-RAHMAN
              </h1>

              <h2 className="mt-2 text-2xl font-semibold md:text-4xl">
                Nur & Pry School
              </h2>

              <p className="mt-5 text-lg font-medium italic">
                Knowledge, Integrity and Power
              </p>

            </div>

            {/* Image Indicators */}
            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">

              {images.map((_, index) => (
                <span
                  key={index}
                  className={`h-2.5 rounded-full transition-all ${
                    currentImage === index
                      ? "w-7 bg-white"
                      : "w-2.5 bg-white/50"
                  }`}
                ></span>
              ))}

            </div>

          </section>

          {/* About School */}
          <section className="mt-8 rounded-2xl bg-white p-8 shadow-sm">

            <div className="text-center">

              <p className="text-sm font-semibold uppercase tracking-widest text-[#8A5A3B]">
                About Our School
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#5C3317] md:text-3xl">
                FADL-UR-RAHMAN Nur & Pry School
              </h2>

              <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-[#5C3317]"></div>

            </div>

            <p className="mx-auto mt-6 max-w-4xl text-center leading-8 text-gray-600">
              FADL-UR-RAHMAN Nur & Pry School is an Islamic school committed
              to providing quality education while nurturing pupils with good
              character, discipline, and strong moral values. The school aims
              to create a supportive learning environment where children can
              develop academically, socially, and spiritually.
            </p>

            <p className="mx-auto mt-4 max-w-4xl text-center leading-8 text-gray-600">
              As an Islamic school, we encourage our pupils to appreciate
              values such as honesty, kindness, respect, responsibility, and
              good conduct, while developing a strong foundation in their
              academic studies and Islamic teachings.
            </p>

          </section>

          {/* Motto */}
          <section className="mt-6 rounded-2xl bg-[#5C3317] p-8 text-center text-white shadow-sm">

            <p className="text-sm font-semibold uppercase tracking-[3px] text-[#E8D5C4]">
              Our School Motto
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Knowledge, Integrity and Power
            </h2>

          </section>

          {/* Islamic Values */}
          <section className="mt-6">

            <div className="mb-5 text-center">

              <h2 className="text-2xl font-bold text-[#5C3317]">
                Our Values
              </h2>

              <p className="mt-2 text-gray-500">
                Values that guide our pupils in learning and character
                development.
              </p>

            </div>

            <div className="grid gap-6 md:grid-cols-3">

              {/* Knowledge */}
              <div className="rounded-2xl border border-[#E5D5C8] bg-white p-6 text-center shadow-sm">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E8DC] text-2xl">
                  📖
                </div>

                <h3 className="mt-4 text-xl font-bold text-[#5C3317]">
                  Knowledge
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Encouraging children to seek beneficial knowledge and
                  develop a love for learning.
                </p>

              </div>

              {/* Integrity */}
              <div className="rounded-2xl border border-[#E5D5C8] bg-white p-6 text-center shadow-sm">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E8DC] text-2xl">
                  🤝
                </div>

                <h3 className="mt-4 text-xl font-bold text-[#5C3317]">
                  Integrity
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Building honesty, responsibility, respect, discipline, and
                  good character.
                </p>

              </div>

              {/* Power */}
              <div className="rounded-2xl border border-[#E5D5C8] bg-white p-6 text-center shadow-sm">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E8DC] text-2xl">
                  ⭐
                </div>

                <h3 className="mt-4 text-xl font-bold text-[#5C3317]">
                  Power
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Empowering pupils with the knowledge and character they
                  need to contribute positively to society.
                </p>

              </div>

            </div>

          </section>

          {/* Mission & Vision */}
          <section className="mt-6 grid gap-6 md:grid-cols-2">

            <div className="rounded-2xl border border-[#E5D5C8] bg-white p-6 shadow-sm">

              <h3 className="text-xl font-bold text-[#5C3317]">
                Our Mission
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                To provide quality education and nurture pupils in a safe,
                disciplined, and encouraging environment.
              </p>

            </div>

            <div className="rounded-2xl border border-[#E5D5C8] bg-white p-6 shadow-sm">

              <h3 className="text-xl font-bold text-[#5C3317]">
                Our Vision
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                To raise confident, knowledgeable, responsible, and
                well-mannered pupils who are prepared for a successful future.
              </p>

            </div>

          </section>

          {/* Classes We Offer */}
          <section className="mt-8">

            <div className="mb-6 text-center">

              <p className="text-sm font-semibold uppercase tracking-widest text-[#8A5A3B]">
                Academics
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#5C3317] md:text-3xl">
                Classes We Offer
              </h2>

              <p className="mx-auto mt-2 max-w-2xl text-gray-500">
                We provide quality learning from early childhood through
                primary education.
              </p>

            </div>

            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">

              {/* Creche */}
              <div className="rounded-2xl border border-[#E5D5C8] bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E8DC] text-2xl">
                  🧸
                </div>

                <h3 className="mt-4 text-lg font-bold text-[#5C3317]">
                  Creche
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Early childhood care and learning.
                </p>

              </div>

              {/* Prep */}
              <div className="rounded-2xl border border-[#E5D5C8] bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E8DC] text-2xl">
                  🎨
                </div>

                <h3 className="mt-4 text-lg font-bold text-[#5C3317]">
                  Prep
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Preparing young learners for school.
                </p>

              </div>

              {/* Nur 1 */}
              <div className="rounded-2xl border border-[#E5D5C8] bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E8DC] text-2xl">
                  📖
                </div>

                <h3 className="mt-4 text-lg font-bold text-[#5C3317]">
                  Nur 1
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Building strong learning foundations.
                </p>

              </div>

              {/* Nur 2 */}
              <div className="rounded-2xl border border-[#E5D5C8] bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E8DC] text-2xl">
                  ✏️
                </div>

                <h3 className="mt-4 text-lg font-bold text-[#5C3317]">
                  Nur 2
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Developing knowledge and confidence.
                </p>

              </div>

              {/* KG */}
              <div className="rounded-2xl border border-[#E5D5C8] bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E8DC] text-2xl">
                  🌱
                </div>

                <h3 className="mt-4 text-lg font-bold text-[#5C3317]">
                  KG
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Growing through learning and play.
                </p>

              </div>

              {/* Basic 1 */}
              <div className="rounded-2xl border border-[#E5D5C8] bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E8DC] text-2xl">
                  📚
                </div>

                <h3 className="mt-4 text-lg font-bold text-[#5C3317]">
                  Basic 1
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Developing essential academic skills.
                </p>

              </div>

              {/* Basic 2 */}
              <div className="rounded-2xl border border-[#E5D5C8] bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E8DC] text-2xl">
                  📝
                </div>

                <h3 className="mt-4 text-lg font-bold text-[#5C3317]">
                  Basic 2
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Strengthening academic knowledge.
                </p>

              </div>

              {/* Basic 3 */}
              <div className="rounded-2xl border border-[#E5D5C8] bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E8DC] text-2xl">
                  🔢
                </div>

                <h3 className="mt-4 text-lg font-bold text-[#5C3317]">
                  Basic 3
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Encouraging deeper understanding.
                </p>

              </div>

              {/* Basic 4 */}
              <div className="rounded-2xl border border-[#E5D5C8] bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E8DC] text-2xl">
                  🎓
                </div>

                <h3 className="mt-4 text-lg font-bold text-[#5C3317]">
                  Basic 4
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Preparing pupils for advanced learning.
                </p>

              </div>

              {/* Basic 5 */}
              <div className="rounded-2xl border border-[#E5D5C8] bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E8DC] text-2xl">
                  🏆
                </div>

                <h3 className="mt-4 text-lg font-bold text-[#5C3317]">
                  Basic 5
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Building confidence for the next stage.
                </p>

              </div>

            </div>

          </section>

          {/* Why Choose Our School */}
          <section className="mt-10">

            <div className="mb-6 text-center">

              <p className="text-sm font-semibold uppercase tracking-widest text-[#8A5A3B]">
                Why Choose Us
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#5C3317] md:text-3xl">
                Why Choose Our School?
              </h2>

              <p className="mx-auto mt-2 max-w-2xl text-gray-500">
                We are committed to providing an environment where every
                child can learn, grow, and develop good character.
              </p>

            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {/* Quality Education */}
              <div className="rounded-2xl border border-[#E5D5C8] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E8DC] text-2xl">
                  📚
                </div>

                <h3 className="mt-4 text-xl font-bold text-[#5C3317]">
                  Quality Education
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  We provide a strong academic foundation that encourages
                  pupils to learn, think, ask questions, and develop useful
                  skills.
                </p>

              </div>

              {/* Dedicated Teachers */}
              <div className="rounded-2xl border border-[#E5D5C8] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E8DC] text-2xl">
                  👩‍🏫
                </div>

                <h3 className="mt-4 text-xl font-bold text-[#5C3317]">
                  Dedicated Teachers
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Our teachers are committed to supporting pupils and helping
                  them reach their academic and personal potential.
                </p>

              </div>

              {/* Islamic Values */}
              <div className="rounded-2xl border border-[#E5D5C8] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E8DC] text-2xl">
                  🕌
                </div>

                <h3 className="mt-4 text-xl font-bold text-[#5C3317]">
                  Islamic Values
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  We encourage honesty, kindness, respect, discipline, good
                  conduct, and other values that support positive character.
                </p>

              </div>

              {/* Supportive Environment */}
              <div className="rounded-2xl border border-[#E5D5C8] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E8DC] text-2xl">
                  🏫
                </div>

                <h3 className="mt-4 text-xl font-bold text-[#5C3317]">
                  Supportive Environment
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  We aim to provide a welcoming learning environment where
                  pupils can develop confidence and participate actively.
                </p>

              </div>

              {/* Character Development */}
              <div className="rounded-2xl border border-[#E5D5C8] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E8DC] text-2xl">
                  ❤️
                </div>

                <h3 className="mt-4 text-xl font-bold text-[#5C3317]">
                  Character Development
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Beyond academics, we help pupils develop responsibility,
                  confidence, respect, and positive habits.
                </p>

              </div>

              {/* Child Development */}
              <div className="rounded-2xl border border-[#E5D5C8] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E8DC] text-2xl">
                  🌟
                </div>

                <h3 className="mt-4 text-xl font-bold text-[#5C3317]">
                  Child Development
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  We encourage pupils to grow academically, socially,
                  emotionally, and in their ability to work with others.
                </p>

              </div>

            </div>

          </section>

          {/* School Announcements */}
          <section className="mt-10">

            <div className="mb-6 text-center">

              <p className="text-sm font-semibold uppercase tracking-widest text-[#8A5A3B]">
                Stay Updated
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#5C3317] md:text-3xl">
                School Announcements
              </h2>

              <p className="mx-auto mt-2 max-w-2xl text-gray-500">
                Important information and updates from FADL-UR-RAHMAN
                Nursery & Primary School.
              </p>

            </div>

            {announcementsLoading ? (

              <div className="rounded-2xl border border-[#E5D5C8] bg-white p-8 text-center shadow-sm">

                <p className="text-gray-500">
                  Loading announcements...
                </p>

              </div>

            ) : announcements.length === 0 ? (

              <div className="rounded-2xl border border-[#E5D5C8] bg-white p-8 text-center shadow-sm">

                <p className="text-gray-500">
                  No announcements available at the moment.
                </p>

              </div>

            ) : (

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                {announcements.map((announcement) => (

                  <div
                    key={announcement.id}
                    className="rounded-2xl border border-[#E5D5C8] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F3E8DC] text-xl">
                        📢
                      </div>

                      <span className="rounded-full bg-[#F3E8DC] px-3 py-1 text-xs font-semibold capitalize text-[#5C3317]">
                        {announcement.type}
                      </span>

                    </div>

                    <h3 className="mt-5 text-lg font-bold text-[#5C3317]">
                      {announcement.title}
                    </h3>

                    <p className="mt-3 leading-7 text-gray-600">
                      {announcement.message}
                    </p>

                    <p className="mt-4 text-xs font-medium text-[#8A5A3B]">
                      {new Date(
                        announcement.created_at
                      ).toLocaleDateString()}
                    </p>

                  </div>

                ))}

              </div>

            )}

          </section>

          {/* School Activities */}
          <section className="mt-10">

            <div className="mb-6 text-center">

              <p className="text-sm font-semibold uppercase tracking-widest text-[#8A5A3B]">
                Life At Our School
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#5C3317] md:text-3xl">
                School Activities
              </h2>

              <p className="mx-auto mt-2 max-w-2xl text-gray-500">
                Learning at FADL-UR-RAHMAN goes beyond the classroom.
                Our pupils take part in activities that support learning,
                creativity, teamwork, and character development.
              </p>

            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {/* Sports */}
              <div className="rounded-2xl border border-[#E5D5C8] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E8DC] text-2xl">
                  🏃
                </div>

                <h3 className="mt-4 text-xl font-bold text-[#5C3317]">
                  Sports & Physical Activities
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Pupils participate in physical activities that encourage
                  teamwork, fitness, discipline, and confidence.
                </p>

              </div>

              {/* Creative Activities */}
              <div className="rounded-2xl border border-[#E5D5C8] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E8DC] text-2xl">
                  🎨
                </div>

                <h3 className="mt-4 text-xl font-bold text-[#5C3317]">
                  Creative Activities
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Creative activities help pupils express themselves,
                  discover their talents, and develop their imagination.
                </p>

              </div>

              {/* Reading */}
              <div className="rounded-2xl border border-[#E5D5C8] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E8DC] text-2xl">
                  📖
                </div>

                <h3 className="mt-4 text-xl font-bold text-[#5C3317]">
                  Reading & Learning
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  We encourage pupils to develop a love for reading and
                  continue learning both inside and outside the classroom.
                </p>

              </div>

              {/* Islamic Activities */}
              <div className="rounded-2xl border border-[#E5D5C8] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E8DC] text-2xl">
                  🕌
                </div>

                <h3 className="mt-4 text-xl font-bold text-[#5C3317]">
                  Islamic Activities
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Pupils are encouraged to learn Islamic teachings and
                  develop good manners, discipline, and moral values.
                </p>

              </div>

              {/* School Events */}
              <div className="rounded-2xl border border-[#E5D5C8] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E8DC] text-2xl">
                  🎉
                </div>

                <h3 className="mt-4 text-xl font-bold text-[#5C3317]">
                  School Events
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  School events give pupils opportunities to celebrate,
                  learn together, build friendships, and develop confidence.
                </p>

              </div>

              {/* Group Activities */}
              <div className="rounded-2xl border border-[#E5D5C8] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E8DC] text-2xl">
                  👥
                </div>

                <h3 className="mt-4 text-xl font-bold text-[#5C3317]">
                  Group Activities
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Pupils work together on activities that develop
                  communication, cooperation, leadership, and respect.
                </p>

              </div>

            </div>

          </section>

        </main>

      </div>

    </div>
  )
}

export default Dashboard

