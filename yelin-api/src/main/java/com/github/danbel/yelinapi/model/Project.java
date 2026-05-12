package com.github.danbel.yelinapi.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record Project(
        Long id,
        String name,
        String description,
        String customer,
        String address,
        String objectType,
        String status,
        Long managerId,
        LocalDate startDate,
        LocalDate plannedFinishDate,
        LocalDate actualFinishDate,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
