package com.github.danbel.yelinapi.service;

import com.github.danbel.yelinapi.dto.ChatDtos.ChatMessageResponse;
import com.github.danbel.yelinapi.model.ChatMessage;
import com.github.danbel.yelinapi.model.User;
import com.github.danbel.yelinapi.repository.ChatRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {
    private final ChatRepository chatRepository;
    private final ProjectService projectService;
    private final UserService userService;

    public ChatService(ChatRepository chatRepository, ProjectService projectService, UserService userService) {
        this.chatRepository = chatRepository;
        this.projectService = projectService;
        this.userService = userService;
    }

    public List<ChatMessageResponse> findMessages(Long projectId, User user) {
        checkAccess(projectId, user);
        return chatRepository.findByProjectId(projectId).stream().map(this::toResponse).toList();
    }

    public ChatMessageResponse findLastMessage(Long projectId, User user) {
        checkAccess(projectId, user);
        return chatRepository.findLastByProjectId(projectId).map(this::toResponse).orElse(null);
    }

    public ChatMessageResponse create(Long projectId, User user, String message) {
        checkAccess(projectId, user);
        if (message == null || message.isBlank()) {
            throw new IllegalArgumentException("Сообщение не может быть пустым");
        }
        Long id = chatRepository.create(projectId, user.id(), message.trim());
        return chatRepository.findByProjectId(projectId).stream()
                .filter(item -> item.id().equals(id))
                .findFirst()
                .map(this::toResponse)
                .orElseThrow();
    }

    private void checkAccess(Long projectId, User user) {
        if (!projectService.canOpenProjectChat(projectId, user)) {
            throw new IllegalArgumentException("Нет доступа к чату проекта");
        }
    }

    private ChatMessageResponse toResponse(ChatMessage message) {
        var author = userService.getUser(message.userId());
        return new ChatMessageResponse(
                message.id(),
                message.projectId(),
                message.userId(),
                author.fullName(),
                author.role(),
                message.message(),
                message.createdAt()
        );
    }
}
