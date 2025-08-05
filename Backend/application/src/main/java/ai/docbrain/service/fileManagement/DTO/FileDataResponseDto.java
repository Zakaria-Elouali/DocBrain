package ai.docbrain.service.fileManagement.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FileDataResponseDto {
    private Long id;
    private byte[] fileData;
    private String content;  // Added for text-based files like markdown
    private String type;     // Added to indicate the file type

    // Constructor for binary files
    public FileDataResponseDto(Long id, byte[] fileData, String type) {
        this.id = id;
        this.fileData = fileData;
        this.type = type;
        this.content = null;
    }

    // Constructor for text files
    public FileDataResponseDto(Long id, String content, String type) {
        this.id = id;
        this.content = content;
        this.type = type;
        this.fileData = null;
    }
}