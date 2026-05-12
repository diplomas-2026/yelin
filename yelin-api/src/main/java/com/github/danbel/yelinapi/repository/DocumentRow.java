package com.github.danbel.yelinapi.repository;

import java.time.LocalDateTime;

public record DocumentRow(
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
