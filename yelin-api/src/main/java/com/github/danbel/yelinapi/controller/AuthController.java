package com.github.danbel.yelinapi.controller;

import com.github.danbel.yelinapi.dto.AuthDtos.LoginRequest;
import com.github.danbel.yelinapi.dto.AuthDtos.LoginResponse;
import com.github.danbel.yelinapi.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
