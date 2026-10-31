import { createContext, useContext, useEffect, useState } from 'react'

const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)

const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}
const EMPTY = { enrolled: {}, scores: {} } // enrolled: {courseId: [doneLessonIndexes]}, scores: {courseId: {score,total}}

// Demo auth using localStorage. Replace register/login with calls to Spring (/auth/register, /auth/login).
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => read('lp_user', null))
  const [data, setData] = useState(EMPTY)

  useEffect(() => { setData(user ? read(`lp_data_${user.email}`, EMPTY) : EMPTY) }, [user])
  useEffect(() => { if (user) localStorage.setItem(`lp_data_${user.email}`, JSON.stringify(data)) }, [data, user])

  const register = ({ name, email, password }) => {
    const users = read('lp_users', [])
    if (users.some((u) => u.email === email)) throw new Error('This email is already registered. Log in instead.')
    localStorage.setItem('lp_users', JSON.stringify([...users, { name, email, password }]))
    const u = { name, email }
    localStorage.setItem('lp_user', JSON.stringify(u)); setUser(u)
  }
  const login = ({ email, password }) => {
    const found = read('lp_users', []).find((u) => u.email === email && u.password === password)
    if (!found) throw new Error('Email or password is incorrect.')
    const u = { name: found.name, email }
    localStorage.setItem('lp_user', JSON.stringify(u)); setUser(u)
  }
  const logout = () => { localStorage.removeItem('lp_user'); setUser(null) }

  const enroll = (id) => setData((d) => (d.enrolled[id] ? d : { ...d, enrolled: { ...d.enrolled, [id]: [] } }))
  const toggleLesson = (id, i) => setData((d) => {
    const done = d.enrolled[id] || []
    const next = done.includes(i) ? done.filter((x) => x !== i) : [...done, i]
    return { ...d, enrolled: { ...d.enrolled, [id]: next } }
  })
  const saveScore = (id, score, total) => setData((d) => ({ ...d, scores: { ...d.scores, [id]: { score, total } } }))

  return (
    <Ctx.Provider value={{ user, data, register, login, logout, enroll, toggleLesson, saveScore }}>
      {children}
    </Ctx.Provider>
  )
}
