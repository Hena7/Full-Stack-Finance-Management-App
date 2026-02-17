package com.insa.budgetwise.controller;

import com.insa.budgetwise.dto.AuthResponse;
import com.insa.budgetwise.dto.LoginRequest;
import com.insa.budgetwise.dto.RegisterRequest;
import com.insa.budgetwise.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticate(
            @RequestBody LoginRequest request) {
        return ResponseEntity.ok(service.authenticate(request));
    }
}
