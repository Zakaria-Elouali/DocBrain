package ai.docbrain.service.dashboard.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for company storage metrics
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyStorageMetricsDTO {
    private double totalStorageInMB;
    private double usedStorageInMB;
    private double availableStorageInMB;
    private double usagePercentage;
}
