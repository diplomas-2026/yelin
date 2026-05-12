package com.github.danbel.yelinapi.dto;

public class DashboardDtos {
    public record DashboardResponse(
            Integer projectsTotal,
            Integer projectsInWork,
            Integer projectsReview,
            Integer projectsRevision,
            Integer projectsDone,
            Integer documentsTotal,
            Integer usersTotal
    ) {}
}
