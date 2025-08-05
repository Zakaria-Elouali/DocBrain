-- Insert default permissions
INSERT INTO permissions (name, description) VALUES
-- Document Management
('DOCUMENT_VIEW', 'Can view documents'),
('DOCUMENT_CREATE', 'Can create new documents'),
('DOCUMENT_EDIT', 'Can edit existing documents'),
('DOCUMENT_DELETE', 'Can delete documents'),
('DOCUMENT_SHARE', 'Can share documents with others'),

-- Folder Management
('FOLDER_VIEW', 'Can view folders'),
('FOLDER_CREATE', 'Can create new folders'),
('FOLDER_EDIT', 'Can modify folder properties'),
('FOLDER_DELETE', 'Can delete folders'),

-- User Management
('USER_VIEW', 'Can view user details'),
('USER_CREATE', 'Can create new users'),
('USER_EDIT', 'Can edit user details'),
('USER_DELETE', 'Can delete users'),

-- Role Management
('ROLE_VIEW', 'Can view roles'),
('ROLE_CREATE', 'Can create new roles'),
('ROLE_EDIT', 'Can edit roles'),
('ROLE_DELETE', 'Can delete roles'),

-- Client Management
('CLIENT_VIEW', 'Can view client details'),
('CLIENT_CREATE', 'Can create new clients'),
('CLIENT_EDIT', 'Can edit client details'),
('CLIENT_DELETE', 'Can delete clients'),

-- Appointment Management
('APPOINTMENT_VIEW', 'Can view appointments'),
('APPOINTMENT_CREATE', 'Can create appointments'),
('APPOINTMENT_EDIT', 'Can edit appointments'),
('APPOINTMENT_DELETE', 'Can delete appointments');

-- Insert default roles
INSERT INTO roles (name, description) VALUES
                                          ('SUPER_ADMIN', 'Full system access with ability to manage roles, permissions, and system configuration'),
                                          ('ADMIN', 'Administrative access with client management and operational control'),
                                          ('VIEWER', 'Read-only access to documents and appointments'),
                                          ('CLIENT', 'Limited access for client users');

-- Assign permissions to SUPER_ADMIN role (all permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'SUPER_ADMIN';

-- Assign permissions to ADMIN role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'ADMIN'
  AND p.name IN (
                 'DOCUMENT_VIEW', 'DOCUMENT_CREATE', 'DOCUMENT_EDIT', 'DOCUMENT_DELETE', 'DOCUMENT_SHARE',
                 'FOLDER_VIEW', 'FOLDER_CREATE', 'FOLDER_EDIT', 'FOLDER_DELETE',
                 'CLIENT_VIEW', 'CLIENT_CREATE', 'CLIENT_EDIT', 'CLIENT_DELETE',
                 'APPOINTMENT_VIEW', 'APPOINTMENT_CREATE', 'APPOINTMENT_EDIT', 'APPOINTMENT_DELETE',
                 'USER_VIEW'
    );

-- Assign permissions to VIEWER role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'VIEWER'
  AND p.name IN (
                 'DOCUMENT_VIEW',
                 'FOLDER_VIEW',
                 'APPOINTMENT_VIEW',
                 'CLIENT_VIEW'
    );

-- Assign permissions to CLIENT role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'CLIENT'
  AND p.name IN (
                 'DOCUMENT_VIEW', 'DOCUMENT_CREATE',
                 'FOLDER_VIEW',
                 'APPOINTMENT_VIEW', 'APPOINTMENT_CREATE'
    );