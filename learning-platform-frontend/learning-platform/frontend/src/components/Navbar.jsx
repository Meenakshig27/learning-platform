import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  return (
    <header className="nav">
      <Link to="/" className="brand">LearnSphere</Link>
      <nav>
        <NavLink to="/courses">Courses</NavLink>
        {user && <NavLink to="/dashboard">Dashboard</NavLink>}
        {user ? (
          <button className="btn ghost" onClick={() => { logout(); nav('/') }}>Log out ({user.name.split(' ')[0]})</button>
        ) : (
          <>
            <NavLink to="/login">Log in</NavLink>
            <Link to="/register" className="btn">Sign up</Link>
          </>
        )}
      </nav>
    </header>
  )
}
