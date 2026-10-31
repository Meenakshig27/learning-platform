# LearnSphere – Backend (Spring Boot + MySQL)

Spring MVC REST API with JWT authentication, course enrollment, lesson progress and quizzes.

## Run locally
1. Install JDK 17 and MySQL. Remember your MySQL root password.
2. Open `src/main/resources/application.properties` and change `root` in `DB_PASSWORD:root` to your password.
3. Run `LearningPlatformApplication.java` (VS Code: Run button above `main`).
4. Open http://localhost:8080/ and you should see `{"status":"LearnSphere API is running"}`.

The database `learning_platform`, all tables and 6 sample courses are created automatically.

## Endpoints
| Method | URL | Auth |
|--------|-----|------|
| POST | /api/auth/register | public |
| POST | /api/auth/login | public |
| GET | /api/courses, /api/courses/{id} | public |
| POST | /api/courses/{id}/enroll | token |
| PUT | /api/courses/{id}/lessons/{index}/toggle | token |
| POST | /api/courses/{id}/quiz/attempt | token |
| GET | /api/me/dashboard | token |

## MySQL tables
users, courses, lessons, enrollments, quizzes, questions, question_options, quiz_attempts, progress
