package com.learnsphere.service;

import com.learnsphere.dto.Dtos.AuthResponse;
import com.learnsphere.dto.Dtos.LoginRequest;
import com.learnsphere.dto.Dtos.RegisterRequest;
import com.learnsphere.model.User;
import com.learnsphere.repository.UserRepository;
import com.learnsphere.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthService(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    public AuthResponse register(RegisterRequest req) {
        String email = req.email().trim().toLowerCase();
        if (users.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This email is already registered. Log in instead.");
        }
        User u = new User();
        u.setName(req.name().trim());
        u.setEmail(email);
        u.setPassword(encoder.encode(req.password()));
        users.save(u);
        return new AuthResponse(jwt.generate(email), u.getName(), email, u.getRole());
    }

    public AuthResponse login(LoginRequest req) {
        String email = req.email().trim().toLowerCase();
        User u = users.findByEmail(email)
                .filter(found -> encoder.matches(req.password(), found.getPassword()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email or password is incorrect."));
        return new AuthResponse(jwt.generate(email), u.getName(), email, u.getRole());
    }
}
