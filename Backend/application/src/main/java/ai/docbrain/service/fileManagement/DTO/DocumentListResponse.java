package ai.docbrain.service.fileManagement.DTO;


import ai.docbrain.domain.fileManagement.Document;

import java.util.List;

public class DocumentListResponse {
    private List<Document> documents;

    public DocumentListResponse(List<Document> documents) {
        this.documents = documents;
    }

    public List<Document> getDocuments() {
        return documents;
    }

    public void setDocuments(List<Document> documents) {
        this.documents = documents;
    }
}