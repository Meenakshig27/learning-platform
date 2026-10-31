package com.learnsphere.config;

import com.learnsphere.model.*;
import com.learnsphere.repository.CourseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

// Inserts the sample courses once, when the courses table is empty.
@Component
public class DataSeeder implements CommandLineRunner {
    private final CourseRepository courses;

    public DataSeeder(CourseRepository courses) {
        this.courses = courses;
    }

    // Free YouTube video course (freeCodeCamp) shown for each course.
    private static final Map<String, String> VIDEOS = Map.of(
            "React JS Fundamentals", "bMknfKXIFA8",
            "Spring MVC Essentials", "31KTdfRH6nY",
            "MySQL for Developers", "ER8oKX5myE0",
            "JavaScript Deep Dive", "PkZNo7MFNFg",
            "Git and GitHub Workflow", "RGOj5yH7evk",
            "REST API Design", "WXsD0ZgxjRw");

    @Override
    public void run(String... args) {
        if (courses.count() == 0) seed();
        VIDEOS.forEach(courses::setVideo); // also fills videos for databases created earlier
    }

    private void seed() {

        add("React JS Fundamentals", "Web Development", "Beginner", 8,
            "Build reusable components, manage state with hooks and create single-page apps.",
            List.of("What is React?", "JSX and components", "Props and state", "Hooks: useState and useEffect", "Routing with React Router"),
            q("Which hook stores state in a function component?", 1, "useRef", "useState", "useMemo", "useId"),
            q("What does JSX compile to?", 1, "HTML strings", "React.createElement calls", "CSS", "JSON"),
            q("How do parents pass data to children?", 1, "State", "Props", "Refs", "Context only"));

        add("Spring MVC Essentials", "Backend", "Intermediate", 10,
            "Controllers, services, repositories and REST APIs with Spring Boot.",
            List.of("Spring Boot setup", "Controllers and routing", "Service layer", "Spring Data JPA", "Exception handling"),
            q("Which annotation marks a REST controller?", 1, "@Service", "@RestController", "@Entity", "@Bean"),
            q("In MVC, what does the \"M\" stand for?", 1, "Module", "Model", "Method", "Mapping"),
            q("Which interface gives CRUD methods in Spring Data?", 0, "JpaRepository", "Runnable", "Servlet", "Filter"));

        add("MySQL for Developers", "Database", "Beginner", 6,
            "Design tables, write joins and keep your data consistent.",
            List.of("Tables and data types", "SELECT and filtering", "Joins", "Indexes", "Transactions"),
            q("Which key uniquely identifies a row?", 1, "Foreign key", "Primary key", "Index", "View"),
            q("Which JOIN returns only matching rows?", 1, "LEFT JOIN", "INNER JOIN", "CROSS JOIN", "FULL JOIN"),
            q("Which command removes all rows but keeps the table?", 1, "DROP", "TRUNCATE", "ALTER", "RENAME"));

        add("JavaScript Deep Dive", "Web Development", "Intermediate", 9,
            "Closures, promises, async/await and the event loop explained clearly.",
            List.of("Scope and closures", "Prototypes", "Promises", "async / await", "Event loop"),
            q("What does a closure capture?", 1, "The DOM", "Variables from its outer scope", "The call stack", "Only globals"),
            q("Which keyword pauses an async function?", 1, "yield", "await", "defer", "pause"),
            q("Promise.all resolves when…", 1, "any resolves", "all resolve", "first rejects", "never"));

        add("Git and GitHub Workflow", "Tools", "Beginner", 4,
            "Branches, pull requests and deployment with GitHub Pages.",
            List.of("Commits and history", "Branching", "Pull requests", "Resolving conflicts", "GitHub Pages"),
            q("Which command copies a remote repo?", 1, "git pull", "git clone", "git fork", "git init"),
            q("What does git add do?", 1, "Commits files", "Stages files", "Pushes files", "Deletes files"),
            q("A pull request is used to…", 1, "Delete a branch", "Propose and review changes", "Install packages", "Reset history"));

        add("REST API Design", "Backend", "Intermediate", 5,
            "Model resources, choose status codes and secure endpoints with JWT.",
            List.of("Resources and verbs", "Status codes", "Validation", "JWT authentication", "Versioning"),
            q("Which verb creates a new resource?", 1, "GET", "POST", "HEAD", "TRACE"),
            q("Which status code means \"Not Found\"?", 2, "200", "301", "404", "500"),
            q("Where is a JWT usually sent?", 0, "Authorization header", "URL hash", "Cookie name", "HTML body"));
    }

    private Object[] q(String text, int answer, String... options) {
        return new Object[]{text, options, answer};
    }

    private void add(String title, String category, String level, int hours, String description,
                     List<String> lessons, Object[]... questions) {
        Course c = new Course();
        c.setTitle(title);
        c.setCategory(category);
        c.setLevel(level);
        c.setHours(hours);
        c.setDescription(description);

        for (int i = 0; i < lessons.size(); i++) {
            Lesson l = new Lesson();
            l.setCourse(c);
            l.setTitle(lessons.get(i));
            l.setPosition(i);
            c.getLessons().add(l);
        }

        Quiz quiz = new Quiz();
        quiz.setCourse(c);
        quiz.setTitle(title + " quiz");
        for (Object[] item : questions) {
            Question qu = new Question();
            qu.setQuiz(quiz);
            qu.setPrompt((String) item[0]);
            qu.setOptions(new ArrayList<>(Arrays.asList((String[]) item[1])));
            qu.setAnswerIndex((Integer) item[2]);
            quiz.getQuestions().add(qu);
        }
        c.setQuiz(quiz);
        courses.save(c);
    }
}
