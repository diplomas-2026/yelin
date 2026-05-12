package com.github.danbel.yelinapi.repository;

import com.github.danbel.yelinapi.dto.DocumentDtos.DocumentRequest;
import com.github.danbel.yelinapi.model.Document;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class DocumentRepository {
    private final JdbcClient jdbc;

    public DocumentRepository(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    public List<Document> findAll() {
        return jdbc.sql("SELECT * FROM documents ORDER BY id").query(Document.class).list();
    }

    public List<Document> findByProjectId(Long projectId) {
        return jdbc.sql("SELECT * FROM documents WHERE project_id = :projectId ORDER BY id")
                .param("projectId", projectId)
                .query(Document.class)
                .list();
    }

    public Optional<Document> findById(Long id) {
        return jdbc.sql("SELECT * FROM documents WHERE id = :id").param("id", id).query(Document.class).optional();
    }

    public Long create(DocumentRequest request) {
        return jdbc.sql("""
                        INSERT INTO documents (project_id, name, type, file_name, version, status, uploaded_by, comment)
                        VALUES (:projectId, :name, :type, :fileName, :version, :status, :uploadedBy, :comment)
                        RETURNING id
                        """)
                .param("projectId", request.projectId())
                .param("name", request.name())
                .param("type", request.type())
                .param("fileName", request.fileName())
                .param("version", request.version() == null ? 1 : request.version())
                .param("status", request.status())
                .param("uploadedBy", request.uploadedBy())
                .param("comment", request.comment())
                .query(Long.class)
                .single();
    }

    public void update(Long id, DocumentRequest request) {
        jdbc.sql("""
                        UPDATE documents
                        SET project_id = :projectId, name = :name, type = :type, file_name = :fileName,
                            version = :version, status = :status, uploaded_by = :uploadedBy, comment = :comment
                        WHERE id = :id
                        """)
                .param("id", id)
                .param("projectId", request.projectId())
                .param("name", request.name())
                .param("type", request.type())
                .param("fileName", request.fileName())
                .param("version", request.version() == null ? 1 : request.version())
                .param("status", request.status())
                .param("uploadedBy", request.uploadedBy())
                .param("comment", request.comment())
                .update();
    }

    public void delete(Long id) {
        jdbc.sql("DELETE FROM documents WHERE id = :id").param("id", id).update();
    }

    public int countByProjectId(Long projectId) {
        return jdbc.sql("SELECT count(*) FROM documents WHERE project_id = :projectId")
                .param("projectId", projectId)
                .query(Integer.class)
                .single();
    }

    public int count() {
        return jdbc.sql("SELECT count(*) FROM documents").query(Integer.class).single();
    }
}
