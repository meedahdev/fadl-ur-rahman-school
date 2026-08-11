import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./Pages/Login"
import Dashboard from "./Pages/Dashboard"
import ProtectedRoute from "./Layout/ProtectedRoute"
import Students from "./Pages/Students"
import Teachers from "./Pages/Teachers"
import Classes from "./Pages/Classes"
import Attendance from "./Pages/Attendance"
import Results from "./Pages/Results"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> } />
        <Route path="/students" element={<Students />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/results" element={<Results />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App