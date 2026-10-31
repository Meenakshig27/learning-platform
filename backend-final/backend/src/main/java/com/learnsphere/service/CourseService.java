package com.learnsphere.service;

import com.learnsphere.dto.Dtos.*;
import com.learnsphere.model.*;
import com.learnsphere.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CourseService {
    private final CourseRepository courses;
    private final EnrollmentRepository enrollments;
    private final ProgressRepository progress;
    private final QuizAttemptRepository attempts;

    public CourseService(CourseRepository courses, EnrollmentRepository enrollments,
                         ProgressRepository progress, QuizAttemptRepository attempts) {
        this.courses = courses;
        this.enrollments = enrollments;
        this.progress = progress;
        this.attempts = attempts;
    }

    @Transactional(readOnly = true)
    public List<CourseDto> all() {
        return courses.findAll().stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public CourseDto get(Long id) {
        return toDto(find(id));
    }

    @Transactional
    public void enroll(User user, Long courseId) {
        Course c = find(courseId);
        if (!enrollments.existsByUserAndCourse(user, c)) {
            Enrollment e = new Enrollment();
            e.setUser(user);
            e.setCourse(c);
            enrollments.save(e);
        }
    }

    @Transactional
    public List<Integer> toggleLesson(User user, Long courseId, int index) {
        Course c = find(courseId);
        requireEnrolled(user, c);
        if (index < 0 || index >= c.getLessons().size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Lesson not found.");
        }
        Lesson lesson = c.getLessons().get(index);
        Optional<Progress> existing = progress.findByUserAndLesson(user, lesson);
        if (existing.isPresent()) {
            progress.delete(existing.get());
        } else {
            Progress p = new Progress();
            p.setUser(user);
            p.setLesson(lesson);
            progress.save(p);
        }
        return doneIndexes(user, c);
    }

    @Transactional
    public ScoreDto attempt(User user, Long courseId, List<Integer> answers) {
        Course c = find(courseId);
        requireEnrolled(user, c);
        if (c.getQuiz() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "This course has no quiz.");
        }
        List<Integer> given = answers == null ? List.of() : answers;
        List<Question> qs = c.getQuiz().getQuestions();
        int score = 0;
        for (int i = 0; i < qs.size(); i++) {
            if (i < given.size() && given.get(i) != null && given.get(i) == qs.get(i).getAnswerIndex()) score++;
        }
        QuizAttempt a = new QuizAttempt();
        a.setUser(user);
        a.setCourse(c);
        a.setScore(score);
        a.setTotal(qs.size());
        attempts.save(a);
        return new ScoreDto(score, qs.size());
    }

    @Transactional(readOnly = true)
    public DashboardDto dashboard(User user) {
        Map<Long, List<Integer>> enrolled = new LinkedHashMap<>();
        for (Enrollment e : enrollments.findByUser(user)) {
            enrolled.put(e.getCourse().getId(), doneIndexes(user, e.getCourse()));
        }
        Map<Long, ScoreDto> scores = new LinkedHashMap<>();
        for (QuizAttempt a : attempts.findByUserOrderByIdAsc(user)) {
            scores.put(a.getCourse().getId(), new ScoreDto(a.getScore(), a.getTotal())); // latest wins
        }
        return new DashboardDto(enrolled, scores);
    }

    // ---- helpers ----
    private Course find(Long id) {
        return courses.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found."));
    }

    private void requireEnrolled(User user, Course c) {
        if (!enrollments.existsByUserAndCourse(user, c)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Enroll in this course first.");
        }
    }

    private List<Integer> doneIndexes(User user, Course c) {
        Set<Long> doneIds = progress.findByUser(user).stream()
                .map(p -> p.getLesson().getId()).collect(Collectors.toSet());
        List<Lesson> lessons = c.getLessons();
        List<Integer> out = new ArrayList<>();
        for (int i = 0; i < lessons.size(); i++) {
            if (doneIds.contains(lessons.get(i).getId())) out.add(i);
        }
        return out;
    }

    private CourseDto toDto(Course c) {
        List<QuestionDto> quiz = c.getQuiz() == null ? List.of()
                : c.getQuiz().getQuestions().stream()
                    .map(q -> new QuestionDto(q.getPrompt(), new ArrayList<>(q.getOptions()), q.getAnswerIndex()))
                    .toList();
        return new CourseDto(c.getId(), c.getTitle(), c.getCategory(), c.getLevel(), c.getHours(),
                c.getDescription(), c.getVideoId(), c.getLessons().stream().map(Lesson::getTitle).toList(), quiz);
    }
}
