package com.github.danbel.yelinapi.model;

import java.time.LocalDateTime;

public record Document(
        Long id,
        Long projectId,
        String name,
        String type,
        String fileName,
        String mimeType,
        byte[] fileContent,
        Integer version,
        String status,
        Long uploadedBy,
        LocalDateTime uploadedAt,
        String comment
) {
}
