// Temporary data. Once the Spring backend is ready, services/api.js will fetch this from MySQL.
export const TEAM = [
  { name: 'K. Sindhu', roll: '24251A0581' },
  { name: 'C. Ashritha', roll: '24251A05A6' },
  { name: 'G. Meenakshi', roll: '24251A05B2' },
]

const q = (text, options, answer) => ({ text, options, answer })

export const COURSES = [
  {
    id: 1, videoId: 'bMknfKXIFA8', title: 'React JS Fundamentals', category: 'Web Development', level: 'Beginner', hours: 8,
    description: 'Build reusable components, manage state with hooks and create single-page apps.',
    lessons: ['What is React?', 'JSX and components', 'Props and state', 'Hooks: useState and useEffect', 'Routing with React Router'],
    quiz: [
      q('Which hook stores state in a function component?', ['useRef', 'useState', 'useMemo', 'useId'], 1),
      q('What does JSX compile to?', ['HTML strings', 'React.createElement calls', 'CSS', 'JSON'], 1),
      q('How do parents pass data to children?', ['State', 'Props', 'Refs', 'Context only'], 1),
    ],
  },
  {
    id: 2, videoId: '31KTdfRH6nY', title: 'Spring MVC Essentials', category: 'Backend', level: 'Intermediate', hours: 10,
    description: 'Controllers, services, repositories and REST APIs with Spring Boot.',
    lessons: ['Spring Boot setup', 'Controllers and routing', 'Service layer', 'Spring Data JPA', 'Exception handling'],
    quiz: [
      q('Which annotation marks a REST controller?', ['@Service', '@RestController', '@Entity', '@Bean'], 1),
      q('In MVC, what does the "M" stand for?', ['Module', 'Model', 'Method', 'Mapping'], 1),
      q('Which interface gives CRUD methods in Spring Data?', ['JpaRepository', 'Runnable', 'Servlet', 'Filter'], 0),
    ],
  },
  {
    id: 3, videoId: 'ER8oKX5myE0', title: 'MySQL for Developers', category: 'Database', level: 'Beginner', hours: 6,
    description: 'Design tables, write joins and keep your data consistent.',
    lessons: ['Tables and data types', 'SELECT and filtering', 'Joins', 'Indexes', 'Transactions'],
    quiz: [
      q('Which key uniquely identifies a row?', ['Foreign key', 'Primary key', 'Index', 'View'], 1),
      q('Which JOIN returns only matching rows?', ['LEFT JOIN', 'INNER JOIN', 'CROSS JOIN', 'FULL JOIN'], 1),
      q('Which command removes all rows but keeps the table?', ['DROP', 'TRUNCATE', 'ALTER', 'RENAME'], 1),
    ],
  },
  {
    id: 4, videoId: 'PkZNo7MFNFg', title: 'JavaScript Deep Dive', category: 'Web Development', level: 'Intermediate', hours: 9,
    description: 'Closures, promises, async/await and the event loop explained clearly.',
    lessons: ['Scope and closures', 'Prototypes', 'Promises', 'async / await', 'Event loop'],
    quiz: [
      q('What does a closure capture?', ['The DOM', 'Variables from its outer scope', 'The call stack', 'Only globals'], 1),
      q('Which keyword pauses an async function?', ['yield', 'await', 'defer', 'pause'], 1),
      q('Promise.all resolves when…', ['any resolves', 'all resolve', 'first rejects', 'never'], 1),
    ],
  },
  {
    id: 5, videoId: 'RGOj5yH7evk', title: 'Git and GitHub Workflow', category: 'Tools', level: 'Beginner', hours: 4,
    description: 'Branches, pull requests and deployment with GitHub Pages.',
    lessons: ['Commits and history', 'Branching', 'Pull requests', 'Resolving conflicts', 'GitHub Pages'],
    quiz: [
      q('Which command copies a remote repo?', ['git pull', 'git clone', 'git fork', 'git init'], 1),
      q('What does git add do?', ['Commits files', 'Stages files', 'Pushes files', 'Deletes files'], 1),
      q('A pull request is used to…', ['Delete a branch', 'Propose and review changes', 'Install packages', 'Reset history'], 1),
    ],
  },
  {
    id: 6, videoId: 'WXsD0ZgxjRw', title: 'REST API Design', category: 'Backend', level: 'Intermediate', hours: 5,
    description: 'Model resources, choose status codes and secure endpoints with JWT.',
    lessons: ['Resources and verbs', 'Status codes', 'Validation', 'JWT authentication', 'Versioning'],
    quiz: [
      q('Which verb creates a new resource?', ['GET', 'POST', 'HEAD', 'TRACE'], 1),
      q('Which status code means "Not Found"?', ['200', '301', '404', '500'], 2),
      q('Where is a JWT usually sent?', ['Authorization header', 'URL hash', 'Cookie name', 'HTML body'], 0),
    ],
  },
]
