import axios from 'axios'
import { COURSES } from '../data/mock'

// Set VITE_API_URL in .env when the Spring backend is deployed, e.g. https://your-app.onrender.com/api
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api' })
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('lp_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// While the backend is not connected, the app runs on mock data.
export const USE_MOCK = !import.meta.env.VITE_API_URL

export async function fetchCourses() {
  if (USE_MOCK) return COURSES
  return (await api.get('/courses')).data
}

export async function fetchCourse(id) {
  if (USE_MOCK) return COURSES.find((c) => c.id === Number(id))
  return (await api.get(`/courses/${id}`)).data
}
