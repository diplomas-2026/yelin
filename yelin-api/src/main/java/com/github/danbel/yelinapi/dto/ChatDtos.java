package com.github.danbel.yelinapi.dto;

import java.time.LocalDateTime;

public class ChatDtos {
    public record ChatMessageRequest(String message) {}

    public record ChatMessageResponse(
            Long id,
            Long projectId,
            Long userId,
            String authorName,
            String authorRole,
            String message,
            LocalDateTime createdAt
    ) {}
}
