package com.github.danbel.yelinapi.controller;

import com.github.danbel.yelinapi.dto.ProjectDtos.ProjectRequest;
import com.github.danbel.yelinapi.dto.ProjectDtos.ProjectResponse;
import com.github.danbel.yelinapi.dto.ProjectDtos.ProjectStatusRequest;
import com.github.danbel.yelinapi.service.ProjectService;
import com.github.danbel.yelinapi.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projects")
public class ProjectController extends CurrentUserSupport {
    private final ProjectService projectService;

    public ProjectController(ProjectService projectService, UserService userService) {
        super(userService);
        this.projectService = projectService;
    }

    @GetMapping
    public List<ProjectResponse> findAll(Authentication authentication) {
        return projectService.findAllFor(currentUser(authentication));
    }

    @GetMapping("/{id}")
    public ProjectResponse findById(@PathVariable Long id) {
        return projectService.findById(id);
    }

    @PostMapping
    public ProjectResponse create(@RequestBody ProjectRequest request) {
        return projectService.create(request);
    }

    @PutMapping("/{id}")
    public ProjectResponse update(@PathVariable Long id, @RequestBody ProjectRequest request) {
        return projectService.update(id, request);
    }

    @PatchMapping("/{id}/status")
    public ProjectResponse updateStatus(@PathVariable Long id, @RequestBody ProjectStatusRequest request, Authentication authentication) {
        return projectService.updateStatus(id, request.status(), currentUser(authentication));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        projectService.delete(id);
    }
}
