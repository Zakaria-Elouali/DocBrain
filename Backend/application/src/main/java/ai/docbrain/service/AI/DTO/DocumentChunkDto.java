package ai.docbrain.service.AI.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@Data
public class DocumentChunkDto {
    private Long id;
    private String content;
    private Integer chunkOrder;
    private String embedding;
}

