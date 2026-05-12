package com.github.danbel.yelinapi.model;

import java.time.LocalDateTime;

public record ChatMessage(
        Long id,
        Long projectId,
        Long userId,
        String message,
        LocalDateTime createdAt
) {
}
