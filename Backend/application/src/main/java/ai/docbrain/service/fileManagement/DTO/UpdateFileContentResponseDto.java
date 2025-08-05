package ai.docbrain.service.fileManagement.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateFileContentResponseDto {
    private Long id;
    private String name;
    private String type;
    private Long size;
    private ZonedDateTime lastModifiedAt;
    private String message;
}
