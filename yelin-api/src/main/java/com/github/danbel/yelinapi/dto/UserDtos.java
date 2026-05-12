package com.github.danbel.yelinapi.dto;

import java.time.LocalDateTime;

public class UserDtos {
    public record UserRequest(
            String fullName,
            String email,
            String password,
            String role,
            String positionTitle,
            String phone,
            String department,
            Boolean active
    ) {}

    public record UserResponse(
            Long id,
            String fullName,
            String email,
            String role,
            String positionTitle,
            String phone,
            String department,
            Boolean active,
            LocalDateTime createdAt
    ) {}
}
