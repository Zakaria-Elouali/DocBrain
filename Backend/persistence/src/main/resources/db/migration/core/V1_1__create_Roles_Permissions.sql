-- Create permissions table
CREATE TABLE permissions (
                             id BIGSERIAL PRIMARY KEY,
                             name VARCHAR(255) UNIQUE NOT NULL,
                             description TEXT
);

-- Create roles table
CREATE TABLE roles (
                       id BIGSERIAL PRIMARY KEY,
                       name VARCHAR(255) UNIQUE NOT NULL,
                       description TEXT
);

-- Create user_roles join table (many-to-many relationship between users and roles)
CREATE TABLE user_roles (
                            user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
                            role_id BIGINT REFERENCES roles(id) ON DELETE CASCADE,
                            PRIMARY KEY (user_id, role_id)
);

-- Create role_permissions join table (many-to-many relationship between roles and permissions)
CREATE TABLE role_permissions (
                                  role_id BIGINT REFERENCES roles(id) ON DELETE CASCADE,
                                  permission_id BIGINT REFERENCES permissions(id) ON DELETE CASCADE,
                                  PRIMARY KEY (role_id, permission_id)
);