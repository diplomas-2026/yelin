package com.github.danbel.yelinapi.dto;

import com.github.danbel.yelinapi.dto.UserDtos.UserResponse;

public class AuthDtos {
    public record LoginRequest(String email, String password) {}
    public record LoginResponse(String token, UserResponse user) {}
}
