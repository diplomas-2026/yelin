package com.github.danbel.yelinapi.dto;

import com.github.danbel.yelinapi.dto.UserDtos.UserResponse;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class ProjectDtos {
    public record ProjectRequest(
            String name,
            String description,
            String customer,
            String address,
            String objectType,
            String status,
            Long managerId,
            List<Long> engineerIds,
            LocalDate startDate,
            LocalDate plannedFinishDate,
            LocalDate actualFinishDate
    ) {}

    public record ProjectResponse(
            Long id,
            String name,
            String description,
            String customer,
            String address,
            String objectType,
            String status,
            Long managerId,
            String managerName,
            List<UserResponse> engineers,
            Integer documentsCount,
            LocalDate startDate,
            LocalDate plannedFinishDate,
            LocalDate actualFinishDate,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {}

    public record ProjectStatusRequest(String status) {}
}
