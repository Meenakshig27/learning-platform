package com.learnsphere.controller;

import com.learnsphere.dto.Dtos.*;
import com.learnsphere.model.User;
import com.learnsphere.service.CourseService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class CourseController {
    private final CourseService service;

    public CourseController(CourseService service) {
        this.service = service;
    }

    @GetMapping("/courses")
    public List<CourseDto> courses() {
        return service.all();
    }

    @GetMapping("/courses/{id}")
    public CourseDto course(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping("/courses/{id}/enroll")
    public void enroll(@AuthenticationPrincipal User user, @PathVariable Long id) {
        service.enroll(user, id);
    }

    @PutMapping("/courses/{id}/lessons/{index}/toggle")
    public List<Integer> toggle(@AuthenticationPrincipal User user, @PathVariable Long id, @PathVariable int index) {
        return service.toggleLesson(user, id, index);
    }

    @PostMapping("/courses/{id}/quiz/attempt")
    public ScoreDto attempt(@AuthenticationPrincipal User user, @PathVariable Long id, @RequestBody AttemptRequest req) {
        return service.attempt(user, id, req.answers());
    }

    @GetMapping("/me/dashboard")
    public DashboardDto dashboard(@AuthenticationPrincipal User user) {
        return service.dashboard(user);
    }
}
