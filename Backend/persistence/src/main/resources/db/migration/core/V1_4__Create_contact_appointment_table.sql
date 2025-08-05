CREATE TABLE contact (
                         id BIGSERIAL PRIMARY KEY,
                         client_name VARCHAR(255) NOT NULL,
                         phone VARCHAR(50),
                         email VARCHAR(255),
                         company_id BIGINT NOT NULL,
                         FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE appointment (
                             id BIGSERIAL PRIMARY KEY,
                             case_number VARCHAR(255),
                             type VARCHAR(50),
                             date TIMESTAMP,
                             time VARCHAR(50),
                             duration INT,
                             description TEXT,
                             contact_id BIGINT,
                             company_id BIGINT NOT NULL,
                             status VARCHAR(50),
                             FOREIGN KEY (contact_id) REFERENCES contact(id),
                             FOREIGN KEY (company_id) REFERENCES companies(id)
);