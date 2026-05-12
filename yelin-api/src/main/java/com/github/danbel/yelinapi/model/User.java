package com.github.danbel.yelinapi.model;

import java.time.LocalDateTime;

public record User(
        Long id,
        String fullName,
        String email,
        String passwordHash,
        String role,
        String positionTitle,
        String phone,
        String department,
        Boolean active,
        LocalDateTime createdAt
) {
}
