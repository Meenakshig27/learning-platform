package com.learnsphere.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.Map;

// Shapes match what the React frontend already uses (src/data/mock.js).
public class Dtos {
    public record RegisterRequest(
            @NotBlank(message = "Name is required") String name,
            @NotBlank(message = "Email is required") @Email(message = "Enter a valid email") String email,
            @NotBlank(message = "Password is required") @Size(min = 6, message = "Password must be at least 6 characters") String password) {}

    public record LoginRequest(
            @NotBlank(message = "Email is required") String email,
            @NotBlank(message = "Password is required") String password) {}

    public record AuthResponse(String token, String name, String email, String role) {}

    public record QuestionDto(String text, List<String> options, int answer) {}

    public record CourseDto(Long id, String title, String category, String level, int hours,
                            String description, String videoId, List<String> lessons, List<QuestionDto> quiz) {}

    public record AttemptRequest(List<Integer> answers) {}

    public record ScoreDto(int score, int total) {}

    // enrolled: courseId -> finished lesson indexes; scores: courseId -> latest quiz score
    public record DashboardDto(Map<Long, List<Integer>> enrolled, Map<Long, ScoreDto> scores) {}
}
