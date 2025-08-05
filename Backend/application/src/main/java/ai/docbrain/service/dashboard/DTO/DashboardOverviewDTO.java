package ai.docbrain.service.dashboard.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Main DTO for dashboard overview data
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardOverviewDTO {
    private Long companyId;
    private CompanyStorageMetricsDTO storageMetrics;
    private List<FileTypeDistributionDTO> fileTypeDistribution;
    private int totalFolders;
    private int totalDocuments;
    private int totalEmployees;
    private int totalClients;
    private List<RecentActivityDTO > recentActivity;
    private Map<String, Integer> roleDistribution;
    private Map<String, Integer> aiProcessingStats;
    private LocalDateTime generatedAt;
}






