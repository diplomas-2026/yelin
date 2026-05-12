package com.github.danbel.yelinapi.repository;

import com.github.danbel.yelinapi.model.ChatMessage;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ChatRepository {
    private final JdbcClient jdbc;

    public ChatRepository(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    public List<ChatMessage> findByProjectId(Long projectId) {
        return jdbc.sql("SELECT * FROM chat_messages WHERE project_id = :projectId ORDER BY id")
                .param("projectId", projectId)
                .query(ChatMessage.class)
                .list();
    }

    public Optional<ChatMessage> findLastByProjectId(Long projectId) {
        return jdbc.sql("SELECT * FROM chat_messages WHERE project_id = :projectId ORDER BY id DESC LIMIT 1")
                .param("projectId", projectId)
                .query(ChatMessage.class)
                .optional();
    }

    public Long create(Long projectId, Long userId, String message) {
        return jdbc.sql("""
                        INSERT INTO chat_messages (project_id, user_id, message)
                        VALUES (:projectId, :userId, :message)
                        RETURNING id
                        """)
                .param("projectId", projectId)
                .param("userId", userId)
                .param("message", message)
                .query(Long.class)
                .single();
    }

    public void delete(Long id) {
        jdbc.sql("DELETE FROM chat_messages WHERE id = :id").param("id", id).update();
    }
}
