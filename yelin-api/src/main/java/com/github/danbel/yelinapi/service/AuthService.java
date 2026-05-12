package com.github.danbel.yelinapi.service;

import com.github.danbel.yelinapi.dto.AuthDtos.LoginRequest;
import com.github.danbel.yelinapi.dto.AuthDtos.LoginResponse;
import com.github.danbel.yelinapi.security.JwtService;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserService userService;
    private final JwtService jwtService;

    public AuthService(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        var user = userService.getByEmail(request.email());
        if (!Boolean.TRUE.equals(user.active()) || !user.passwordHash().equals(request.password())) {
            throw new IllegalArgumentException("Неверный email или пароль");
        }
        return new LoginResponse(jwtService.generate(user), userService.toResponse(user));
    }
}
