package ai.docbrain.service.fileManagement.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;

@Data
@AllArgsConstructor
public class FileMetadataResponseDto {
    private final Long id;
    private final String name;
    private final String type;
    private final String path;
    private final Long size;
    private final Long folderId;
    private final Long companyId;
    private final String tags;
    private final String summary;
    private final String keywords;
    private final ZonedDateTime accessedAt;
    private final ZonedDateTime lastModifiedAt;
    private final boolean aiProcessed;
}