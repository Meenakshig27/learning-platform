import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchCourses } from '../services/api'
import { useAuth } from '../context/AuthContext'
import CourseCard from '../components/CourseCard'

export default function Dashboard() {
  const { user, data } = useAuth()
  const [courses, setCourses] = useState([])
  useEffect(() => { fetchCourses().then(setCourses) }, [])

  const mine = courses.filter((c) => Array.isArray(data.enrolled[c.id]))
  const pct = (c) => Math.round((data.enrolled[c.id].length / c.lessons.length) * 100)
  const attempts = Object.entries(data.scores)
  const avg = mine.length ? Math.round(mine.reduce((s, c) => s + pct(c), 0) / mine.length) : 0

  return (
    <section className="section">
      <h1 className="page-title">Welcome, {user.name.split(' ')[0]}</h1>
      <div className="stats">
        <div className="card"><b>{mine.length}</b><span>Enrolled courses</span></div>
        <div className="card"><b>{avg}%</b><span>Average progress</span></div>
        <div className="card"><b>{attempts.length}</b><span>Quizzes taken</span></div>
      </div>

      <h2>My courses</h2>
      {mine.length === 0 ? (
        <p className="muted">You have not enrolled yet. <Link to="/courses">Find a course</Link> to get started.</p>
      ) : (
        <div className="grid">{mine.map((c) => <CourseCard key={c.id} course={c} progress={pct(c)} />)}</div>
      )}

      <h2>Quiz scores</h2>
      {attempts.length === 0 ? <p className="muted">No quiz attempts yet. Open an enrolled course and take its quiz.</p> : (
        <table className="table">
          <thead><tr><th>Course</th><th>Score</th></tr></thead>
          <tbody>
            {attempts.map(([cid, s]) => (
              <tr key={cid}><td>{courses.find((c) => c.id === Number(cid))?.title}</td><td>{s.score} / {s.total}</td></tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
