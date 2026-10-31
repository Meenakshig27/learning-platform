package com.learnsphere.controller;

import com.learnsphere.dto.Dtos.AuthResponse;
import com.learnsphere.dto.Dtos.LoginRequest;
import com.learnsphere.dto.Dtos.RegisterRequest;
import com.learnsphere.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService auth;

    public AuthController(AuthService auth) {
        this.auth = auth;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest req) {
        return auth.register(req);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        return auth.login(req);
    }
}
