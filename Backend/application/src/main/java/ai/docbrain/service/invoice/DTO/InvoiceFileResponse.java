package ai.docbrain.service.invoice.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceFileResponse {
    
    private Long id;
    
    private String fileName;
    
    private String filePath;
    
    private Long fileSize;
    
    private String mimeType;
    
    private ZonedDateTime createdAt;
}
