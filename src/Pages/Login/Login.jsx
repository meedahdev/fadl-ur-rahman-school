import "./Login.css"
import logo from "../../Assets/logo.png"
import { useState } from "react"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="school-header">

          <img
            src={logo}
            alt="FADL-UR-RAHMAN Nursery & Primary School Logo"
            className="school-logo"
          />

          <h1>FADL-UR-RAHMAN</h1>
          <p>Nursery & Primary School</p>

        </div>

        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Login to access the school management system</p>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault()

          console.log("Email:", email)
          console.log("Password:", password)
        }}>

          <div className="input-group">
            <label>Email</label>

            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

        </form>

      </div>

    </div>
  )
}

export default Login