package com.github.danbel.yelinapi.dto;

import java.util.List;

public class DashboardDtos {
    public record DashboardResponse(
            Integer projectsTotal,
            Integer projectsInWork,
            Integer projectsReview,
            Integer projectsRevision,
            Integer projectsDone,
            Integer documentsTotal,
            Integer usersTotal,
            List<ChartItem> projectsByStatus,
            List<ChartItem> projectsByObjectType,
            List<ChartItem> documentsByStatus,
            List<ProjectRiskItem> nearestDeadlines
    ) {}

    public record ChartItem(String label, Integer value) {}

    public record ProjectRiskItem(
            Long id,
            String name,
            String status,
            String managerName,
            String plannedFinishDate
    ) {}
}
