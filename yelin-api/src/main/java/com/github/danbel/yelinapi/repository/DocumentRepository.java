package com.github.danbel.yelinapi.repository;

import com.github.danbel.yelinapi.dto.DashboardDtos.ChartItem;
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

    public Long create(Long projectId, String name, String type, String fileName, String mimeType, byte[] fileContent, Long uploadedBy, String comment) {
        return jdbc.sql("""
                        INSERT INTO documents (project_id, name, type, file_name, mime_type, file_content, version, status, uploaded_by, comment)
                        VALUES (:projectId, :name, :type, :fileName, :mimeType, :fileContent, 1, 'В работе', :uploadedBy, :comment)
                        RETURNING id
                        """)
                .param("projectId", projectId)
                .param("name", name)
                .param("type", type)
                .param("fileName", fileName)
                .param("mimeType", mimeType)
                .param("fileContent", fileContent)
                .param("uploadedBy", uploadedBy)
                .param("comment", comment)
                .query(Long.class)
                .single();
    }

    public void update(Long id, Long projectId, String name, String type, String fileName, String mimeType, byte[] fileContent, Long uploadedBy, String comment) {
        jdbc.sql("""
                        UPDATE documents
                        SET project_id = :projectId, name = :name, type = :type, file_name = :fileName,
                            mime_type = :mimeType, file_content = COALESCE(:fileContent, file_content),
                            uploaded_by = :uploadedBy, comment = :comment
                        WHERE id = :id
                        """)
                .param("id", id)
                .param("projectId", projectId)
                .param("name", name)
                .param("type", type)
                .param("fileName", fileName)
                .param("mimeType", mimeType)
                .param("fileContent", fileContent)
                .param("uploadedBy", uploadedBy)
                .param("comment", comment)
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

    public List<ChartItem> countByStatuses() {
        return jdbc.sql("SELECT status AS label, count(*)::int AS value FROM documents GROUP BY status ORDER BY status")
                .query(ChartItem.class)
                .list();
    }

    public Optional<Document> findLastByProjectId(Long projectId) {
        return jdbc.sql("SELECT * FROM documents WHERE project_id = :projectId ORDER BY id DESC LIMIT 1")
                .param("projectId", projectId)
                .query(Document.class)
                .optional();
    }
}
