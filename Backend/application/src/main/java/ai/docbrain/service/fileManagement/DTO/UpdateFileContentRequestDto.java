package ai.docbrain.service.fileManagement.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateFileContentRequestDto {
    private String content;
    private String contentType; // For future extensibility to handle different file types
}
