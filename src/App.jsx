import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./Pages/Login"
import Dashboard from "./Pages/Dashboard"
import Students from "./Pages/Students"
import Teachers from "./Pages/Teachers"
import Classes from "./Pages/Classes"
import Attendance from "./Pages/Attendance"
import Results from "./Pages/Results"
import Settings from "./Pages/Settings"

import ProtectedRoute from "./Layout/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* DASHBOARD
            Admin + Teacher + Student */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* STUDENTS
            Admin + Teacher */}
        <Route
          path="/students"
          element={
            <ProtectedRoute allowedRoles={["admin", "teacher"]}>
              <Students />
            </ProtectedRoute>
          }
        />

        {/* TEACHERS
            Admin only */}
        <Route
          path="/teachers"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Teachers />
            </ProtectedRoute>
          }
        />

        {/* CLASSES Admin only */}
        <Route
          path="/classes"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Classes />
            </ProtectedRoute>
          }
        />

        {/* ATTENDANCE
            Admin + Teacher + Student */}
        <Route
          path="/attendance"
          element={
            <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
              <Attendance />
            </ProtectedRoute>
          }
        />
        
        {/* RESULTS
            Admin + Teacher + Student */}
        <Route
          path="/results"
          element={
            <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
              <Results />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
              <Settings />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App