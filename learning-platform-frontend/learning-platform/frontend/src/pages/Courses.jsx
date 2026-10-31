import { useEffect, useMemo, useState } from 'react'
import { fetchCourses } from '../services/api'
import CourseCard from '../components/CourseCard'

export default function Courses() {
  const [all, setAll] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => { fetchCourses().then(setAll) }, [])
  const categories = useMemo(() => ['All', ...new Set(all.map((c) => c.category))], [all])
  const shown = all.filter((c) =>
    (category === 'All' || c.category === category) &&
    c.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <section className="section">
      <h1 className="page-title">All courses</h1>
      <div className="filters">
        <input placeholder="Search courses" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search courses" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      {shown.length === 0 ? <p className="muted">No courses match your search. Try a different word or category.</p> :
        <div className="grid">{shown.map((c) => <CourseCard key={c.id} course={c} />)}</div>}
    </section>
  )
}
