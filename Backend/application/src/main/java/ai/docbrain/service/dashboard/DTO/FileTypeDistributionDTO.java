package ai.docbrain.service.dashboard.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for file type distribution
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileTypeDistributionDTO {
    private String fileType;
    private Long count;
    private float sizeInMB;
    private double percentageOfTotal;
}
