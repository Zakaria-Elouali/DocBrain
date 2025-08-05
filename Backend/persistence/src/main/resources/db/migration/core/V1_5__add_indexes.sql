-- Add indexes for better query performance
CREATE INDEX idx_user_profile ON users(id, profile_picture);
CREATE INDEX idx_user_company ON users(company_id);
CREATE INDEX idx_user_email ON users(email);