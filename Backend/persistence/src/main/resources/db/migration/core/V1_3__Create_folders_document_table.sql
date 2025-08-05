CREATE TABLE folders (
                         id BIGSERIAL PRIMARY KEY,
                         name VARCHAR(255) NOT NULL,
                         parent_id BIGINT,
                         company_id BIGINT NOT NULL,
                         type VARCHAR(50) DEFAULT 'folder',
                         tags VARCHAR(255),
                         ai_suggested BOOLEAN,
                         created_by VARCHAR(255),
                         created_at TIMESTAMP WITH TIME ZONE,
                         last_modified_by VARCHAR(255),
                         last_modified_at TIMESTAMP WITH TIME ZONE,
                         status_code VARCHAR(255) DEFAULT 'ACTIVE',
                         FOREIGN KEY (company_id) REFERENCES companies(id),
                         FOREIGN KEY (parent_id) REFERENCES folders(id)
);


CREATE TABLE documents (
                           id BIGSERIAL PRIMARY KEY,
                           name VARCHAR(255) NOT NULL,
                           type VARCHAR(50) NOT NULL,
                           path VARCHAR(255) NOT NULL,
                           size BIGINT NOT NULL,  -- Change from DECIMAL to BIGINT
                           file_data BYTEA NOT NULL,
                           folder_id BIGINT,
                           company_id BIGINT NOT NULL,
                           tags VARCHAR(255),
                           summary TEXT,
                           keywords VARCHAR(255),
                           vector_representation BYTEA,
                           accessed_at TIMESTAMP WITH TIME ZONE,
                           ai_processed BOOLEAN NOT NULL DEFAULT FALSE,
                           created_by VARCHAR(255),
                           created_at TIMESTAMP WITH TIME ZONE,
                           last_modified_by VARCHAR(255),
                           last_modified_at TIMESTAMP WITH TIME ZONE,
                           status_code VARCHAR(255) DEFAULT 'ACTIVE',
                           FOREIGN KEY (company_id) REFERENCES companies(id),
                           FOREIGN KEY (folder_id) REFERENCES folders(id)
);

CREATE TABLE folder_clients (
                                folder_id BIGINT NOT NULL,
                                client_id BIGINT NOT NULL,
                                PRIMARY KEY (folder_id, client_id),
                                FOREIGN KEY (folder_id) REFERENCES folders(id),
                                FOREIGN KEY (client_id) REFERENCES users(id)
);