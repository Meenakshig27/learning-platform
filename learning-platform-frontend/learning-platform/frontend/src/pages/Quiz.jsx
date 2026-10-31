import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchCourse } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Quiz() {
  const { id } = useParams()
  const { saveScore } = useAuth()
  const [course, setCourse] = useState(null)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)

  useEffect(() => { fetchCourse(id).then(setCourse) }, [id])
  if (!course) return <section className="section"><p className="muted">Loading quiz…</p></section>

  const qs = course.quiz
  const score = answers.filter((a, i) => a === qs[i].answer).length

  const next = () => {
    if (step + 1 < qs.length) return setStep(step + 1)
    saveScore(course.id, score, qs.length)
    setFinished(true)
  }
  const restart = () => { setStep(0); setAnswers([]); setFinished(false) }

  if (finished) {
    return (
      <section className="section narrow">
        <h1 className="page-title">Your result</h1>
        <div className="card result">
          <div className="big">{score} / {qs.length}</div>
          <p>{score === qs.length ? 'Perfect score.' : score >= qs.length / 2 ? 'Good work. Review the missed topics and try again.' : 'Revisit the lessons, then retry the quiz.'}</p>
        </div>
        <ul className="review">
          {qs.map((q, i) => (
            <li key={q.text} className={answers[i] === q.answer ? 'ok' : 'bad'}>
              <strong>{q.text}</strong>
              <span>Your answer: {q.options[answers[i]]}{answers[i] !== q.answer && ` · Correct: ${q.options[q.answer]}`}</span>
            </li>
          ))}
        </ul>
        <div className="row">
          <button className="btn" onClick={restart}>Retry quiz</button>
          <Link to="/dashboard" className="btn ghost">Go to dashboard</Link>
        </div>
      </section>
    )
  }

  const q = qs[step]
  const picked = answers[step]
  return (
    <section className="section narrow">
      <div className="meta">{course.title} · Question {step + 1} of {qs.length}</div>
      <h1 className="page-title">{q.text}</h1>
      {q.options.map((o, i) => (
        <button key={o} className={`opt ${picked === i ? 'selected' : ''}`}
          onClick={() => { const a = [...answers]; a[step] = i; setAnswers(a) }}>{o}</button>
      ))}
      <button className="btn lg" disabled={picked === undefined} onClick={next}>
        {step + 1 < qs.length ? 'Next question' : 'Submit quiz'}
      </button>
    </section>
  )
}
