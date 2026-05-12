package com.github.danbel.yelinapi.controller;

import com.github.danbel.yelinapi.dto.UserDtos.UserRequest;
import com.github.danbel.yelinapi.dto.UserDtos.UserResponse;
import com.github.danbel.yelinapi.dto.ProjectDtos.ProjectResponse;
import com.github.danbel.yelinapi.service.ProjectService;
import com.github.danbel.yelinapi.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;
    private final ProjectService projectService;

    public UserController(UserService userService, ProjectService projectService) {
        this.userService = userService;
        this.projectService = projectService;
    }

    @GetMapping
    public List<UserResponse> findAll() {
        return userService.findAll();
    }

    @GetMapping("/{id}")
    public UserResponse findById(@PathVariable Long id) {
        return userService.findById(id);
    }

    @GetMapping("/{id}/projects")
    public List<ProjectResponse> findProjects(@PathVariable Long id) {
        return projectService.findByUserId(id);
    }

    @PostMapping
    public UserResponse create(@RequestBody UserRequest request) {
        return userService.create(request);
    }

    @PutMapping("/{id}")
    public UserResponse update(@PathVariable Long id, @RequestBody UserRequest request) {
        return userService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }
}
