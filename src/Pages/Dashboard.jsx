import { useEffect, useState } from "react"
import Sidebar from "../Components/Sidebar"
import Topbar from "../Components/Topbar"

import school1 from "../Assets/SchoolImages/school1.jpeg"
import school2 from "../Assets/SchoolImages/school2.jpeg"
import school3 from "../Assets/SchoolImages/school3.jpeg"
import school4 from "../Assets/SchoolImages/school4.jpeg"

function Dashboard() {
  const images = [school1, school2, school3, school4]

  const [currentImage, setCurrentImage] = useState(0)

  // Automatically change image every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [images.length])

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

          {/* Temporary Mission & Vision */}
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

        </main>

      </div>

    </div>
  )
}

export default Dashboard