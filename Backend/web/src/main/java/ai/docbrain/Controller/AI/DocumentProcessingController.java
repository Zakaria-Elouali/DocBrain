package ai.docbrain.Controller.AI;



import ai.docbrain.service.AI.DTO.aiModel.ProcessedDocumentDTO;
import ai.docbrain.service.AI.DocumentProcessingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentProcessingController {

    private final DocumentProcessingService documentProcessingService;

    @PostMapping("/process")
    public ResponseEntity<?> processDocument(@RequestParam("documentId") Long documentId) {
        try {
            documentProcessingService.sendDocumentForProcessing(documentId);
            return ResponseEntity.ok().body("Document sent for processing");
        } catch (Exception e) {
            log.error("Error sending document for processing", e);
            return ResponseEntity.internalServerError().body("Error processing document: " + e.getMessage());
        }
    }

    @PostMapping("/process/callback")
    public ResponseEntity<Map<String, String>> processCallback(@RequestBody ProcessedDocumentDTO callbackRequest) {
        try {
            documentProcessingService.handleProcessingCallback(callbackRequest);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Processing results received");
            response.put("status", "success");
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            log.error("Error handling processing callback", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error handling callback: " + e.getMessage());
            errorResponse.put("status", "error");
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}