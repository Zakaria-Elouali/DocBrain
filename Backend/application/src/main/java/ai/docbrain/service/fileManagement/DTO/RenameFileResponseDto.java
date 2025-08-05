package ai.docbrain.service.fileManagement.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RenameFileResponseDto {
    private Long id;
    private String name;
    private String type;
    private String path;
    private Long size;
    private Long folderId;
    private Long companyId;
    private ZonedDateTime lastModifiedAt;
    private String message;
}
