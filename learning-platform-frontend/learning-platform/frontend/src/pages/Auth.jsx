import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AuthForm({ mode }) {
  const { login, register } = useAuth()
  const nav = useNavigate()
  const [f, setF] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const isReg = mode === 'register'
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (isReg) {
        if (f.password.length < 6) throw new Error('Password must be at least 6 characters.')
        await register(f)
      } else await login(f)
      nav('/dashboard')
    } catch (err) { setError(err.message) }
    setBusy(false)
  }

  return (
    <section className="section narrow">
      <h1 className="page-title">{isReg ? 'Create your account' : 'Log in'}</h1>
      <form className="card form" onSubmit={submit}>
        {isReg && <label>Full name<input required value={f.name} onChange={set('name')} /></label>}
        <label>Email<input required type="email" value={f.email} onChange={set('email')} /></label>
        <label>Password<input required type="password" value={f.password} onChange={set('password')} /></label>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn lg" disabled={busy}>{busy ? 'Please wait…' : isReg ? 'Create account' : 'Log in'}</button>
        <p className="muted">
          {isReg ? <>Already registered? <Link to="/login">Log in</Link></> : <>New here? <Link to="/register">Create an account</Link></>}
        </p>
      </form>
    </section>
  )
}
export const Login = () => <AuthForm mode="login" />
export const Register = () => <AuthForm mode="register" />
