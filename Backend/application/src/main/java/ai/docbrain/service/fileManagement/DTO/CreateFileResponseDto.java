package ai.docbrain.service.fileManagement.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateFileResponseDto {
    private Long id;
    private String name;
    private String type;
    private String path;
    private Long size;
    private Long folderId;
    private Long companyId;
    private String message;
}
