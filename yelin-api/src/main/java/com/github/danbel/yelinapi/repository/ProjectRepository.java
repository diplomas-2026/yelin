package com.github.danbel.yelinapi.repository;

import com.github.danbel.yelinapi.dto.ProjectDtos.ProjectRequest;
import com.github.danbel.yelinapi.model.Project;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public class ProjectRepository {
    private final JdbcClient jdbc;

    public ProjectRepository(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    public List<Project> findAll() {
        return jdbc.sql("SELECT * FROM projects ORDER BY id").query(Project.class).list();
    }

    public Optional<Project> findById(Long id) {
        return jdbc.sql("SELECT * FROM projects WHERE id = :id").param("id", id).query(Project.class).optional();
    }

    public List<Project> findAvailableForUser(Long userId, String role) {
        if ("ADMIN".equals(role)) {
            return findAll();
        }
        return jdbc.sql("""
                        SELECT DISTINCT p.* FROM projects p
                        LEFT JOIN project_engineers pe ON pe.project_id = p.id
                        WHERE p.manager_id = :userId OR pe.user_id = :userId
                        ORDER BY p.id
                        """)
                .param("userId", userId)
                .query(Project.class)
                .list();
    }

    @Transactional
    public Long create(ProjectRequest request) {
        Long id = jdbc.sql("""
                        INSERT INTO projects (name, description, customer, address, object_type, status, manager_id,
                                              start_date, planned_finish_date, actual_finish_date)
                        VALUES (:name, :description, :customer, :address, :objectType, :status, :managerId,
                                :startDate, :plannedFinishDate, :actualFinishDate)
                        RETURNING id
                        """)
                .param("name", request.name())
                .param("description", request.description())
                .param("customer", request.customer())
                .param("address", request.address())
                .param("objectType", request.objectType())
                .param("status", request.status())
                .param("managerId", request.managerId())
                .param("startDate", request.startDate())
                .param("plannedFinishDate", request.plannedFinishDate())
                .param("actualFinishDate", request.actualFinishDate())
                .query(Long.class)
                .single();
        replaceEngineers(id, request.engineerIds());
        return id;
    }

    @Transactional
    public void update(Long id, ProjectRequest request) {
        jdbc.sql("""
                        UPDATE projects
                        SET name = :name, description = :description, customer = :customer, address = :address,
                            object_type = :objectType, status = :status, manager_id = :managerId,
                            start_date = :startDate, planned_finish_date = :plannedFinishDate,
                            actual_finish_date = :actualFinishDate, updated_at = CURRENT_TIMESTAMP
                        WHERE id = :id
                        """)
                .param("id", id)
                .param("name", request.name())
                .param("description", request.description())
                .param("customer", request.customer())
                .param("address", request.address())
                .param("objectType", request.objectType())
                .param("status", request.status())
                .param("managerId", request.managerId())
                .param("startDate", request.startDate())
                .param("plannedFinishDate", request.plannedFinishDate())
                .param("actualFinishDate", request.actualFinishDate())
                .update();
        replaceEngineers(id, request.engineerIds());
    }

    public void updateStatus(Long id, String status) {
        jdbc.sql("UPDATE projects SET status = :status, updated_at = CURRENT_TIMESTAMP WHERE id = :id")
                .param("id", id)
                .param("status", status)
                .update();
    }

    public void delete(Long id) {
        jdbc.sql("DELETE FROM projects WHERE id = :id").param("id", id).update();
    }

    public List<Long> findEngineerIds(Long projectId) {
        return jdbc.sql("SELECT user_id FROM project_engineers WHERE project_id = :projectId ORDER BY user_id")
                .param("projectId", projectId)
                .query(Long.class)
                .list();
    }

    public boolean isParticipant(Long projectId, Long userId) {
        Integer count = jdbc.sql("""
                        SELECT count(*) FROM projects p
                        LEFT JOIN project_engineers pe ON pe.project_id = p.id
                        WHERE p.id = :projectId AND (p.manager_id = :userId OR pe.user_id = :userId)
                        """)
                .param("projectId", projectId)
                .param("userId", userId)
                .query(Integer.class)
                .single();
        return count > 0;
    }

    public int countByStatus(String status) {
        return jdbc.sql("SELECT count(*) FROM projects WHERE status = :status")
                .param("status", status)
                .query(Integer.class)
                .single();
    }

    public int count() {
        return jdbc.sql("SELECT count(*) FROM projects").query(Integer.class).single();
    }

    private void replaceEngineers(Long projectId, List<Long> engineerIds) {
        jdbc.sql("DELETE FROM project_engineers WHERE project_id = :projectId").param("projectId", projectId).update();
        if (engineerIds == null) {
            return;
        }
        engineerIds.forEach(userId -> jdbc.sql("INSERT INTO project_engineers (project_id, user_id) VALUES (:projectId, :userId)")
                .param("projectId", projectId)
                .param("userId", userId)
                .update());
    }
}
