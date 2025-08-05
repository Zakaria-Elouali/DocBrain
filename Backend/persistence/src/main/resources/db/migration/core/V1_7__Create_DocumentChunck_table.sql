-- V1__create_document_chunks_table.sql
CREATE TABLE document_chunks (
                                 id BIGSERIAL PRIMARY KEY,
                                 document_id BIGINT,
                                 content TEXT,
                                 chunk_order INTEGER,
                                 embedding TEXT,
                                 FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_document_chunks_document_id ON document_chunks(document_id);
CREATE INDEX idx_document_chunks_chunk_order ON document_chunks(document_id, chunk_order);

-- Add comments for better documentation
COMMENT ON TABLE document_chunks IS 'Stores chunks of text extracted from documents for AI processing';
COMMENT ON COLUMN document_chunks.document_id IS 'Reference to the parent document';
COMMENT ON COLUMN document_chunks.content IS 'The text content of this chunk';
COMMENT ON COLUMN document_chunks.chunk_order IS 'The sequential order of this chunk within the document';
COMMENT ON COLUMN document_chunks.embedding IS 'Vector embedding representation of the text content';