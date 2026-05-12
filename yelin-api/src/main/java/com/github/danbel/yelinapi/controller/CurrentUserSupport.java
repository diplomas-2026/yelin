package com.github.danbel.yelinapi.controller;

import com.github.danbel.yelinapi.model.User;
import com.github.danbel.yelinapi.service.UserService;
import org.springframework.security.core.Authentication;

public abstract class CurrentUserSupport {
    protected final UserService userService;

    protected CurrentUserSupport(UserService userService) {
        this.userService = userService;
    }

    protected User currentUser(Authentication authentication) {
        return userService.getByEmail(authentication.getName());
    }
}
