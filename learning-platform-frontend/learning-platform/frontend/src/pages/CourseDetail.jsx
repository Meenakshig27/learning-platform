import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchCourse } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { ProgressBar } from '../components/CourseCard'

export default function CourseDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { user, data, enroll, toggleLesson } = useAuth()
  const [course, setCourse] = useState(null)

  useEffect(() => { fetchCourse(id).then(setCourse) }, [id])
  if (!course) return <section className="section"><p className="muted">Loading course…</p></section>

  const done = data.enrolled[course.id]
  const isEnrolled = Array.isArray(done)
  const pct = isEnrolled ? Math.round((done.length / course.lessons.length) * 100) : 0

  const onEnroll = () => (user ? enroll(course.id) : nav('/login'))

  return (
    <section className="section narrow">
      <span className={`tag ${course.level.toLowerCase()}`}>{course.level}</span>
      <h1 className="page-title">{course.title}</h1>
      <p className="lead">{course.description}</p>
      <div className="meta">{course.category} · {course.hours} hours · {course.lessons.length} lessons</div>

      {isEnrolled ? (
        <>
          <ProgressBar value={pct} />
          <h2>Lessons</h2>
          <ul className="lessons">
            {course.lessons.map((l, i) => (
              <li key={l}>
                <label>
                  <input type="checkbox" checked={done.includes(i)} onChange={() => toggleLesson(course.id, i)} />
                  <span>{l}</span>
                </label>
              </li>
            ))}
          </ul>
          <Link to={`/courses/${course.id}/quiz`} className="btn lg">Take the quiz</Link>
        </>
      ) : (
        <>
          <h2>What you will cover</h2>
          <ul className="lessons plain">{course.lessons.map((l) => <li key={l}>{l}</li>)}</ul>
          <button className="btn lg" onClick={onEnroll}>{user ? 'Enroll in this course' : 'Log in to enroll'}</button>
        </>
      )}
    </section>
  )
}
