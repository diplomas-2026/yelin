package com.github.danbel.yelinapi.service;

import com.github.danbel.yelinapi.dto.UserDtos.UserRequest;
import com.github.danbel.yelinapi.dto.UserDtos.UserResponse;
import com.github.danbel.yelinapi.model.User;
import com.github.danbel.yelinapi.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserResponse> findAll() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    public UserResponse findById(Long id) {
        return toResponse(getUser(id));
    }

    public User getUser(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Пользователь не найден"));
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("Пользователь не найден"));
    }

    public UserResponse create(UserRequest request) {
        userRepository.findByEmail(request.email()).ifPresent(user -> {
            throw new IllegalArgumentException("Пользователь с таким email уже существует");
        });
        Long id = userRepository.create(request);
        return findById(id);
    }

    public UserResponse update(Long id, UserRequest request) {
        userRepository.findByEmail(request.email()).ifPresent(existing -> {
            if (!existing.id().equals(id)) {
                throw new IllegalArgumentException("Пользователь с таким email уже существует");
            }
        });
        userRepository.update(id, request);
        return findById(id);
    }

    public void delete(Long id) {
        userRepository.delete(id);
    }

    public UserResponse toResponse(User user) {
        return new UserResponse(
                user.id(),
                user.fullName(),
                user.email(),
                user.role(),
                user.positionTitle(),
                user.phone(),
                user.department(),
                user.active(),
                user.createdAt()
        );
    }
}
