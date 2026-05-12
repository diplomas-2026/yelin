ALTER TABLE documents
    ADD COLUMN IF NOT EXISTS mime_type VARCHAR(255),
    ADD COLUMN IF NOT EXISTS file_content BYTEA;

UPDATE documents
SET
    mime_type = COALESCE(mime_type, 'application/octet-stream'),
    file_content = COALESCE(
        file_content,
        convert_to(
            'Demo file for document ' || name || E'\nOriginal file: ' || file_name || E'\nProject id: ' || project_id::text,
            'UTF8'
        )
    )
WHERE file_content IS NULL;
