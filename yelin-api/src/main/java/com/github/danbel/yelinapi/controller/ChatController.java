package com.github.danbel.yelinapi.controller;

import com.github.danbel.yelinapi.dto.ChatDtos.ChatMessageRequest;
import com.github.danbel.yelinapi.dto.ChatDtos.ChatMessageResponse;
import com.github.danbel.yelinapi.service.ChatService;
import com.github.danbel.yelinapi.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projects/{projectId}/chat")
public class ChatController extends CurrentUserSupport {
    private final ChatService chatService;

    public ChatController(ChatService chatService, UserService userService) {
        super(userService);
        this.chatService = chatService;
    }

    @GetMapping
    public List<ChatMessageResponse> findMessages(@PathVariable Long projectId, Authentication authentication) {
        return chatService.findMessages(projectId, currentUser(authentication));
    }

    @GetMapping("/last")
    public ChatMessageResponse findLastMessage(@PathVariable Long projectId, Authentication authentication) {
        return chatService.findLastMessage(projectId, currentUser(authentication));
    }

    @PostMapping
    public ChatMessageResponse create(@PathVariable Long projectId, @RequestBody ChatMessageRequest request, Authentication authentication) {
        return chatService.create(projectId, currentUser(authentication), request.message());
    }
}
