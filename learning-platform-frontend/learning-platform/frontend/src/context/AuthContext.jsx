import { createContext, useContext, useEffect, useState } from 'react'
import { api, USE_MOCK } from '../services/api'

const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)

const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}
const EMPTY = { enrolled: {}, scores: {} } // enrolled: {courseId: [doneLessonIndexes]}, scores: {courseId: {score,total}}

const errorText = (err) =>
  err.response?.data?.message ||
  (err.request ? 'Cannot reach the server. Check that the backend is running.' : err.message)

// With VITE_API_URL set, everything goes to the Spring backend (MySQL).
// Without it, the app falls back to localStorage demo mode.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => read('lp_user', null))
  const [data, setData] = useState(EMPTY)

  const saveSession = (u, token) => {
    localStorage.setItem('lp_user', JSON.stringify(u))
    if (token) localStorage.setItem('lp_token', token)
    setUser(u)
  }
  const logout = () => {
    localStorage.removeItem('lp_user')
    localStorage.removeItem('lp_token')
    setUser(null)
  }

  // Load this user's enrollments, progress and scores
  useEffect(() => {
    if (!user) { setData(EMPTY); return }
    if (USE_MOCK) { setData(read(`lp_data_${user.email}`, EMPTY)); return }
    api.get('/me/dashboard').then((r) => setData(r.data)).catch(() => logout())
  }, [user])

  useEffect(() => {
    if (user && USE_MOCK) localStorage.setItem(`lp_data_${user.email}`, JSON.stringify(data))
  }, [data, user])

  const register = async ({ name, email, password }) => {
    if (USE_MOCK) {
      const users = read('lp_users', [])
      if (users.some((u) => u.email === email)) throw new Error('This email is already registered. Log in instead.')
      localStorage.setItem('lp_users', JSON.stringify([...users, { name, email, password }]))
      return saveSession({ name, email })
    }
    try {
      const { data: r } = await api.post('/auth/register', { name, email, password })
      saveSession({ name: r.name, email: r.email, role: r.role }, r.token)
    } catch (err) { throw new Error(errorText(err)) }
  }

  const login = async ({ email, password }) => {
    if (USE_MOCK) {
      const found = read('lp_users', []).find((u) => u.email === email && u.password === password)
      if (!found) throw new Error('Email or password is incorrect.')
      return saveSession({ name: found.name, email })
    }
    try {
      const { data: r } = await api.post('/auth/login', { email, password })
      saveSession({ name: r.name, email: r.email, role: r.role }, r.token)
    } catch (err) { throw new Error(errorText(err)) }
  }

  const enroll = async (id) => {
    if (!USE_MOCK) await api.post(`/courses/${id}/enroll`)
    setData((d) => (d.enrolled[id] ? d : { ...d, enrolled: { ...d.enrolled, [id]: [] } }))
  }

  const toggleLesson = async (id, i) => {
    if (!USE_MOCK) {
      const r = await api.put(`/courses/${id}/lessons/${i}/toggle`)
      setData((d) => ({ ...d, enrolled: { ...d.enrolled, [id]: r.data } }))
      return
    }
    setData((d) => {
      const done = d.enrolled[id] || []
      const next = done.includes(i) ? done.filter((x) => x !== i) : [...done, i]
      return { ...d, enrolled: { ...d.enrolled, [id]: next } }
    })
  }

  // Backend mode: the server calculates the score and stores the attempt in MySQL.
  const submitQuiz = async (id, answers, score, total) => {
    let result = { score, total }
    if (!USE_MOCK) result = (await api.post(`/courses/${id}/quiz/attempt`, { answers })).data
    setData((d) => ({ ...d, scores: { ...d.scores, [id]: result } }))
    return result
  }

  return (
    <Ctx.Provider value={{ user, data, register, login, logout, enroll, toggleLesson, submitQuiz }}>
      {children}
    </Ctx.Provider>
  )
}
