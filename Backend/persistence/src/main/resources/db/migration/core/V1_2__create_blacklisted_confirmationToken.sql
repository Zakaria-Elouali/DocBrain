
-- Create blacklisted_tokens table
CREATE TABLE blacklisted_tokens (
                                    id BIGSERIAL PRIMARY KEY,
                                    token VARCHAR(255) NOT NULL,
                                    expiration TIMESTAMP NOT NULL
);

-- Create confirmation_tokens table
CREATE TABLE confirmation_tokens (
                                     token_id BIGSERIAL PRIMARY KEY,
                                     confirmation_token VARCHAR(255) UNIQUE NOT NULL,
                                     created_date TIMESTAMP NOT NULL,
                                     expiry_date TIMESTAMP NOT NULL,
                                     user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);