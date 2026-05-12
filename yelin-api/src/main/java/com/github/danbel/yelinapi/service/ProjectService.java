package com.github.danbel.yelinapi.service;

import com.github.danbel.yelinapi.dto.ProjectDtos.ProjectRequest;
import com.github.danbel.yelinapi.dto.ProjectDtos.ProjectResponse;
import com.github.danbel.yelinapi.model.Project;
import com.github.danbel.yelinapi.model.User;
import com.github.danbel.yelinapi.repository.DocumentRepository;
import com.github.danbel.yelinapi.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {
    private static final List<String> ENGINEER_EDIT_STATUSES = List.of("В работе", "На доработке");

    private final ProjectRepository projectRepository;
    private final UserService userService;
    private final DocumentRepository documentRepository;

    public ProjectService(ProjectRepository projectRepository, UserService userService, DocumentRepository documentRepository) {
        this.projectRepository = projectRepository;
        this.userService = userService;
        this.documentRepository = documentRepository;
    }

    public List<ProjectResponse> findAllFor(User user) {
        return projectRepository.findAvailableForUser(user.id(), user.role()).stream().map(this::toResponse).toList();
    }

    public List<ProjectResponse> findAll() {
        return projectRepository.findAll().stream().map(this::toResponse).toList();
    }

    public ProjectResponse findById(Long id) {
        return toResponse(getProject(id));
    }

    public Project getProject(Long id) {
        return projectRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Проект не найден"));
    }

    public ProjectResponse create(ProjectRequest request) {
        Long id = projectRepository.create(normalize(request));
        return findById(id);
    }

    public ProjectResponse update(Long id, ProjectRequest request) {
        projectRepository.update(id, normalize(request));
        return findById(id);
    }

    public ProjectResponse updateStatus(Long id, String status, User user) {
        Project project = getProject(id);
        if ("ENGINEER".equals(user.role()) && (!ENGINEER_EDIT_STATUSES.contains(project.status()) || !"На проверке".equals(status))) {
            throw new IllegalArgumentException("Инженер может отправлять на проверку только проекты в работе или на доработке");
        }
        projectRepository.updateStatus(id, status);
        return findById(id);
    }

    public void delete(Long id) {
        projectRepository.delete(id);
    }

    public boolean canOpenProjectChat(Long projectId, User user) {
        return "ADMIN".equals(user.role()) || projectRepository.isParticipant(projectId, user.id());
    }

    public ProjectResponse toResponse(Project project) {
        User manager = userService.getUser(project.managerId());
        var engineers = projectRepository.findEngineerIds(project.id()).stream()
                .map(userService::getUser)
                .map(userService::toResponse)
                .toList();
        return new ProjectResponse(
                project.id(),
                project.name(),
                project.description(),
                project.customer(),
                project.address(),
                project.objectType(),
                project.status(),
                project.managerId(),
                manager.fullName(),
                engineers,
                documentRepository.countByProjectId(project.id()),
                project.startDate(),
                project.plannedFinishDate(),
                project.actualFinishDate(),
                project.createdAt(),
                project.updatedAt()
        );
    }

    private ProjectRequest normalize(ProjectRequest request) {
        String status = request.status() == null || request.status().isBlank() ? "Новый" : request.status();
        return new ProjectRequest(
                request.name(),
                request.description(),
                request.customer(),
                request.address(),
                request.objectType(),
                status,
                request.managerId(),
                request.engineerIds(),
                request.startDate(),
                request.plannedFinishDate(),
                request.actualFinishDate()
        );
    }
}
