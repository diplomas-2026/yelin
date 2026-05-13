package com.github.danbel.yelinapi.repository;

import com.github.danbel.yelinapi.dto.UserDtos.UserRequest;
import com.github.danbel.yelinapi.model.User;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class UserRepository {
    private final JdbcClient jdbc;

    public UserRepository(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    public List<User> findAll() {
        return jdbc.sql("SELECT * FROM app_users WHERE active = true ORDER BY id").query(User.class).list();
    }

    public Optional<User> findById(Long id) {
        return jdbc.sql("SELECT * FROM app_users WHERE id = :id AND active = true")
                .param("id", id)
                .query(User.class)
                .optional();
    }

    public Optional<User> findByEmail(String email) {
        return jdbc.sql("SELECT * FROM app_users WHERE lower(email) = lower(:email)")
                .param("email", email)
                .query(User.class)
                .optional();
    }

    public Long create(UserRequest request) {
        return jdbc.sql("""
                        INSERT INTO app_users (full_name, email, password_hash, role, position_title, phone, department, active)
                        VALUES (:fullName, :email, :passwordHash, :role, :positionTitle, :phone, :department, :active)
                        RETURNING id
                        """)
                .param("fullName", request.fullName())
                .param("email", request.email())
                .param("passwordHash", request.password() == null || request.password().isBlank() ? "password" : request.password())
                .param("role", request.role())
                .param("positionTitle", request.positionTitle())
                .param("phone", request.phone())
                .param("department", request.department())
                .param("active", request.active() == null || request.active())
                .query(Long.class)
                .single();
    }

    public void update(Long id, UserRequest request) {
        String passwordSql = request.password() == null || request.password().isBlank() ? "" : ", password_hash = :passwordHash";
        var spec = jdbc.sql("""
                        UPDATE app_users
                        SET full_name = :fullName, email = :email, role = :role, position_title = :positionTitle,
                            phone = :phone, department = :department, active = :active
                        """ + passwordSql + " WHERE id = :id")
                .param("id", id)
                .param("fullName", request.fullName())
                .param("email", request.email())
                .param("role", request.role())
                .param("positionTitle", request.positionTitle())
                .param("phone", request.phone())
                .param("department", request.department())
                .param("active", request.active() == null || request.active());
        if (!passwordSql.isEmpty()) {
            spec = spec.param("passwordHash", request.password());
        }
        spec.update();
    }

    public void delete(Long id) {
        jdbc.sql("UPDATE app_users SET active = false WHERE id = :id").param("id", id).update();
    }

    public boolean existsActiveById(Long id) {
        Integer count = jdbc.sql("SELECT count(*) FROM app_users WHERE id = :id AND active = true")
                .param("id", id)
                .query(Integer.class)
                .single();
        return count > 0;
    }

    public int count() {
        return jdbc.sql("SELECT count(*) FROM app_users").query(Integer.class).single();
    }
}
