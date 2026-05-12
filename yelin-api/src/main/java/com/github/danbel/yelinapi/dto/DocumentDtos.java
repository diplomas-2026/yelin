package com.github.danbel.yelinapi.dto;

import java.time.LocalDateTime;

public class DocumentDtos {
    public record DocumentRequest(
            Long projectId,
            String name,
            String type,
            String fileName,
            Integer version,
            String status,
            Long uploadedBy,
            String comment
    ) {}

    public record DocumentResponse(
            Long id,
            Long projectId,
            String projectName,
            String name,
            String type,
            String fileName,
            String mimeType,
            Integer version,
            String status,
            Long uploadedBy,
            String uploadedByName,
            LocalDateTime uploadedAt,
            String comment
    ) {}
}
