package com.github.danbel.yelinapi.service;

import com.github.danbel.yelinapi.dto.DashboardDtos.DashboardResponse;
import com.github.danbel.yelinapi.repository.DocumentRepository;
import com.github.danbel.yelinapi.repository.ProjectRepository;
import com.github.danbel.yelinapi.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {
    private final ProjectRepository projectRepository;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    public DashboardService(ProjectRepository projectRepository, DocumentRepository documentRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
    }

    public DashboardResponse getDashboard() {
        return new DashboardResponse(
                projectRepository.count(),
                projectRepository.countByStatus("В работе"),
                projectRepository.countByStatus("На проверке"),
                projectRepository.countByStatus("На доработке"),
                projectRepository.countByStatus("Завершен"),
                documentRepository.count(),
                userRepository.count(),
                projectRepository.countByStatuses(),
                projectRepository.countByObjectTypes(),
                documentRepository.countByStatuses(),
                projectRepository.findNearestDeadlines()
        );
    }
}
