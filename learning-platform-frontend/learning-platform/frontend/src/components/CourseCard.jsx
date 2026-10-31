import { Link } from 'react-router-dom'

export default function CourseCard({ course, progress }) {
  return (
    <Link to={`/courses/${course.id}`} className="card course">
      <span className={`tag ${course.level.toLowerCase()}`}>{course.level}</span>
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <div className="meta">{course.category} · {course.hours} hours · {course.lessons.length} lessons{course.videoId ? ' · Video course' : ''}</div>
      {progress !== undefined && <ProgressBar value={progress} />}
    </Link>
  )
}

export function ProgressBar({ value }) {
  return (
    <div className="progress" role="progressbar" aria-valuenow={value} aria-valuemin="0" aria-valuemax="100">
      <div style={{ width: `${value}%` }} />
      <span>{value}%</span>
    </div>
  )
}
