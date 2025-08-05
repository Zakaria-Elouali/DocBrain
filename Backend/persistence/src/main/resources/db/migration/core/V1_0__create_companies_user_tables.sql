-- V1__create_tables.sql

-- Create companies table
CREATE TABLE companies (
                           id BIGSERIAL PRIMARY KEY,
                           company_name VARCHAR(255) NOT NULL,
                           activity VARCHAR(255),
                           ice VARCHAR(255) UNIQUE,
                           fiscal_id VARCHAR(255) UNIQUE,
                           rc_city VARCHAR(255),
                           professional_tax DOUBLE PRECISION,
                           created_by VARCHAR(255),
                           created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                           last_modified_by VARCHAR(255),
                           last_modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                           status_code VARCHAR(255) DEFAULT 'ACTIVE'
);

-- Create users table
CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       full_name VARCHAR(255) NOT NULL,
                       username VARCHAR(255) UNIQUE NOT NULL,
                       email VARCHAR(255) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       phone VARCHAR(255),
                       profile_picture VARCHAR(255) UNIQUE,
                       profile_picture_size BIGINT,
                       job_title VARCHAR(255),
                       date_of_birth DATE,
                       company_id BIGINT REFERENCES companies(id) ON DELETE SET NULL,
                       two_factor_enabled BOOLEAN,
                       notifications_enabled BOOLEAN,
                       created_by VARCHAR(255),
                       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                       last_modified_by VARCHAR(255),
                       last_modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                       status_code VARCHAR(255) DEFAULT 'INACTIVE'
);