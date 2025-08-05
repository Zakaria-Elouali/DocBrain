package ai.docbrain.service.AI;

import ai.docbrain.domain.fileManagement.Document;


import ai.docbrain.service.AI.DTO.DocumentChunkDto;
import ai.docbrain.service.AI.DTO.aiModel.ProcessedDocumentDTO;
import ai.docbrain.service.fileManagement.IDocumentRepository;
import ai.docbrain.service.utils.EncryptionUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import jakarta.persistence.EntityNotFoundException;

import java.util.Base64;
import java.util.List;


@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentProcessingService {

    private final IDocumentRepository documentRepository;
    private final IDocumentChunkRepository documentChunkRepository;
    private final RestTemplate restTemplate;
    private final EncryptionUtil encryptionUtil;

    @Value("${python.service.url}")
    private String pythonServiceUrl;

    @Transactional
    public void sendDocumentForProcessing(Long documentId) {
        try {
            // Get the document
            Document document = documentRepository.findById(documentId)
                    .orElseThrow(() -> new EntityNotFoundException("Document not found"));

            // Decrypt the document data
            byte[] decryptedFileData = encryptionUtil.decrypt(document.getFileData());
            // Decrypt the document Name
            byte[] decryptedFilenameBytes = encryptionUtil.decrypt(Base64.getDecoder().decode(document.getName()));
            String decryptedFilename = new String(decryptedFilenameBytes);

            // Prepare the request
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            // Create a file resource with .pdf extension
            ByteArrayResource fileResource = new ByteArrayResource(decryptedFileData) {
                @Override
                public String getFilename() {
                    // Ensure filename ends with .pdf
                    String baseName = decryptedFilename;
                    if (!baseName.toLowerCase().endsWith(".pdf")) {
                        baseName = baseName + ".pdf";
                    }
                    return baseName;
                }

                @Override
                public long contentLength() {
                    return decryptedFileData.length;
                }
            };

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", fileResource);
            body.add("documentId", documentId.toString());

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            // Add logging for request debugging
            log.debug("Sending request to Python service. URL: {}, Document ID: {}, Filename: {}, File size: {} bytes",
                    pythonServiceUrl + "/api/v1/process-pdf",
                    documentId,
                    fileResource.getFilename(),
                    decryptedFileData.length);

            // Send to Python service
            ResponseEntity<String> response = restTemplate.exchange(
                    pythonServiceUrl + "/api/v1/process-pdf",
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("Failed to send document to processing service");
            }

            // Update document status
            document.setAiProcessed(true);
            documentRepository.save(document);

        } catch (Exception e) {
            log.error("Error sending document for processing: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to process document", e);
        }
    }

    @Transactional
    public void handleProcessingCallback(ProcessedDocumentDTO processedDocumentDTO) {
        try {
            // Get the document
            Document document = documentRepository.findById(processedDocumentDTO.getDocumentId())
                    .orElseThrow(() -> new EntityNotFoundException("Document not found"));

            // Update document with processing results
            if (processedDocumentDTO.getSummary() != null) {
                document.setSummary(processedDocumentDTO.getSummary());
            }
            if (processedDocumentDTO.getKeywords() != null) {
                document.setKeywords(String.join(",", processedDocumentDTO.getKeywords()));
            }

            // Log the processing results
            log.info("Summary: {}", processedDocumentDTO.getSummary());
            log.info("Keywords: {}", processedDocumentDTO.getKeywords());

            // Save the updated document
            documentRepository.save(document);

//            for (DocumentChunkDto chunk : processedDocumentDTO.getChunks()) {
//                if (chunk.getContent() != null) {
//                    if (chunk.getContent().contains("\u0000")) {
//                        log.warn("NULL byte detected in chunk order {}! Content: {}", chunk.getChunkOrder(), chunk.getContent());
//                    }
//                }
//            }

            // Handle chunks
            if (processedDocumentDTO.getChunks() != null && !processedDocumentDTO.getChunks().isEmpty()) {
                List<DocumentChunkDto> chunks = processedDocumentDTO.getChunks();
                // Save all chunks
                documentChunkRepository.saveAll(chunks, document);
                log.info("Saved {} chunks for document ID: {}", chunks.size(), document.getId());
            }

        } catch (Exception e) {
            log.error("Error handling processing callback: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to handle processing callback", e);
        }
    }
}