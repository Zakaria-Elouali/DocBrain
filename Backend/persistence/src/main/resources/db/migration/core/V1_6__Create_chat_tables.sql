-- __create_chat_tables.sql

-- Create chat_sessions table
CREATE TABLE chat_sessions (
                               id BIGSERIAL PRIMARY KEY,
                               document_id BIGINT NOT NULL,
                               user_id BIGINT NOT NULL,
                               session_name VARCHAR(255),
                               is_general_chat BOOLEAN NOT NULL,
                               created_at TIMESTAMP NOT NULL,
                               last_active_at TIMESTAMP NOT NULL,
                               FOREIGN KEY (document_id) REFERENCES documents(id),
                               FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create chat_messages table
CREATE TABLE chat_messages (
                               id BIGSERIAL PRIMARY KEY,
                               chat_session_id BIGINT NOT NULL,
                               is_user_message BOOLEAN NOT NULL,
                               content TEXT NOT NULL,
                               timestamp TIMESTAMP NOT NULL,
                               FOREIGN KEY (chat_session_id) REFERENCES chat_sessions(id)
);

-- Create indexes for better query performance
CREATE INDEX idx_chat_sessions_document_user ON chat_sessions(document_id, user_id);
CREATE INDEX idx_chat_messages_session ON chat_messages(chat_session_id);
CREATE INDEX idx_chat_messages_timestamp ON chat_messages(timestamp);

-- Add comments for better documentation
COMMENT ON TABLE chat_sessions IS 'Stores chat sessions between users and documents';
COMMENT ON TABLE chat_messages IS 'Stores messages within chat sessions';

COMMENT ON COLUMN chat_sessions.document_id IS 'Reference to the document being discussed';
COMMENT ON COLUMN chat_sessions.user_id IS 'Reference to the user participating in the chat';
COMMENT ON COLUMN chat_sessions.created_at IS 'Timestamp when the chat session was created';
COMMENT ON COLUMN chat_sessions.last_active_at IS 'Timestamp of the last message in the session';

COMMENT ON COLUMN chat_messages.chat_session_id IS 'Reference to the chat session this message belongs to';
COMMENT ON COLUMN chat_messages.is_user_message IS 'True if message is from user, False if from AI';
COMMENT ON COLUMN chat_messages.content IS 'The actual message content';
COMMENT ON COLUMN chat_messages.timestamp IS 'Timestamp when the message was sent';