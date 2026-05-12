CREATE TABLE app_users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(40) NOT NULL,
    position_title VARCHAR(255) NOT NULL,
    phone VARCHAR(40),
    department VARCHAR(120),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    customer VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    object_type VARCHAR(120) NOT NULL,
    status VARCHAR(40) NOT NULL,
    manager_id BIGINT NOT NULL REFERENCES app_users(id),
    start_date DATE,
    planned_finish_date DATE,
    actual_finish_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_engineers (
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, user_id)
);

CREATE TABLE documents (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(120) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(40) NOT NULL,
    uploaded_by BIGINT NOT NULL REFERENCES app_users(id),
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    comment TEXT
);

CREATE TABLE chat_messages (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_manager ON projects(manager_id);
CREATE INDEX idx_documents_project ON documents(project_id);
CREATE INDEX idx_chat_project_id ON chat_messages(project_id, id);
