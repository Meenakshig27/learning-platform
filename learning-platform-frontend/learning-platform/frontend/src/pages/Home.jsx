import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TEAM } from '../data/mock'
import { fetchCourses } from '../services/api'
import CourseCard from '../components/CourseCard'

// The hero is a playable question, so visitors see the quiz feature straight away.
function MiniQuiz() {
  const [picked, setPicked] = useState(null)
  const options = ['useRef', 'useState', 'useMemo']
  return (
    <div className="mini-quiz card">
      <small>Try a question</small>
      <h3>Which hook stores state in a React component?</h3>
      {options.map((o, i) => (
        <button
          key={o}
          className={`opt ${picked !== null ? (i === 1 ? 'right' : picked === i ? 'wrong' : '') : ''}`}
          onClick={() => setPicked(i)}
          disabled={picked !== null}
        >{o}</button>
      ))}
      {picked !== null && (
        <p className="feedback">{picked === 1 ? 'Correct. useState keeps a value between renders.' : 'Not quite. The answer is useState.'}</p>
      )}
    </div>
  )
}

export default function Home() {
  const [courses, setCourses] = useState([])
  useEffect(() => { fetchCourses().then((c) => setCourses(c.slice(0, 3))) }, [])

  return (
    <>
      <section className="hero">
        <div>
          <h1>Learn web development one lesson at a time.</h1>
          <p>Enroll in a course, tick off lessons, take quizzes and watch your progress grow on your dashboard.</p>
          <div className="row">
            <Link to="/courses" className="btn lg">Browse courses</Link>
            <Link to="/register" className="btn ghost lg">Create free account</Link>
          </div>
        </div>
        <MiniQuiz />
      </section>

      <section className="section">
        <h2>Popular courses</h2>
        <div className="grid">{courses.map((c) => <CourseCard key={c.id} course={c} />)}</div>
      </section>

      <section className="section team" id="team">
        <h2>Our team</h2>
        <p className="muted">Built by three students as a full-stack case study: React, Spring MVC and MySQL.</p>
        <div className="grid three">
          {TEAM.map((m) => (
            <div className="card member" key={m.roll}>
              <div className="avatar">{m.name.replace('.', '').split(' ').map((p) => p[0]).join('')}</div>
              <h3>{m.name}</h3>
              <span>Roll No: {m.roll}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
