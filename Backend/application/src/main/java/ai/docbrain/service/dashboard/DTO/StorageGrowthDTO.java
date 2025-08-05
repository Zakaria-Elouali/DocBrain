package ai.docbrain.service.dashboard.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for storage growth data points
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StorageGrowthDTO {
    private LocalDateTime date;
    private Double sizeInMB;
}
