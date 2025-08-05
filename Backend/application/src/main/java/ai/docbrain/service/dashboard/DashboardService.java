package ai.docbrain.service.dashboard;

import ai.docbrain.domain.fileManagement.DocumentActivityLog;
import ai.docbrain.domain.users.User;
import ai.docbrain.service.dashboard.DTO.*;
import ai.docbrain.service.fileManagement.IDocumentActivityLogRepository;
import ai.docbrain.service.fileManagement.IDocumentRepository;
import ai.docbrain.service.fileManagement.IFolderRepository;
import ai.docbrain.service.role.RoleService;
import ai.docbrain.service.user.IUserRepository;
import ai.docbrain.service.utils.EncryptionUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for generating dashboard metrics and insights for a company's
 * document management system.
 */
@RequiredArgsConstructor
@Log4j2
@Service
public class DashboardService {

    private final IDocumentRepository documentRepository;
    private final IFolderRepository folderRepository;
    private final IUserRepository userRepository;
    private final RoleService roleService;
    private final EncryptionUtil encryptionUtil;
    private final IDocumentActivityLogRepository logRepository;

    /**
     * Retrieve comprehensive dashboard overview for a company
     *
     * @param caller The user requesting the dashboard data
     * @return Complete dashboard overview with metrics and insights
     */
    @Transactional(readOnly = true)
    public DashboardOverviewDTO getDashboardOverview(User caller) {
        if (caller == null) {
            log.error("User not found");
            throw new RuntimeException("User not found");
        }

        Long companyId = caller.getCompanyId();
        log.info("Generating dashboard overview for company ID: {}", companyId);

        try {
            // Gather all required metrics
            CompanyStorageMetricsDTO storageMetrics = getCompanyStorageMetrics(companyId);
            List<FileTypeDistributionDTO> fileTypeDistribution = getFileTypeDistribution(companyId);
            int totalFolders = countTotalFolders(companyId);
            int totalDocuments = countTotalDocuments(companyId);
            int totalEmployees = countEmployees(companyId);
            int totalClients = countClients(companyId);
            List<RecentActivityDTO > recentActivity = getRecentUserActivity(companyId);
            Map<String, Integer> aiProcessingStats = getAiProcessingStats(companyId);
            Map<String, Integer> roleDistribution = getRoleDistribution(companyId);

            // Build and return the dashboard overview
            return DashboardOverviewDTO.builder()
                    .companyId(companyId)
                    .storageMetrics(storageMetrics)
                    .fileTypeDistribution(fileTypeDistribution)
                    .totalFolders(totalFolders)
                    .totalDocuments(totalDocuments)
                    .totalEmployees(totalEmployees)
                    .totalClients(totalClients)
                    .recentActivity(recentActivity)
                    .roleDistribution(roleDistribution)
                    .aiProcessingStats(aiProcessingStats)
                    .generatedAt(LocalDateTime.now())
                    .build();

        } catch (Exception e) {
            log.error("Error generating dashboard overview for company ID: {}", companyId, e);
            throw new RuntimeException("Failed to generate dashboard overview", e);
        }
    }

    /**
     * Calculate storage metrics for a company
     *
     * @param companyId The company ID
     * @return Storage metrics including total, used and available storage
     */
    public CompanyStorageMetricsDTO getCompanyStorageMetrics(Long companyId) {
        log.debug("Calculating storage metrics for company ID: {}", companyId);

        // Get total size of all documents for the company
        Long totalSizeInBytes = documentRepository.calculateTotalStorageByCompanyId(companyId);
        if (totalSizeInBytes == null) {
            totalSizeInBytes = 0L;
        }

        // Convert to MB for better readability
        double usedStorageInMB = totalSizeInBytes / (1024.0 * 1024.0);

        // Assuming a company has a storage limit (example: 10GB)
        double storageLimit = 10 * 1024; // 10GB in MB
        double availableStorageInMB = Math.max(0, storageLimit - usedStorageInMB);
        double usagePercentage = (usedStorageInMB / storageLimit) * 100;

        return CompanyStorageMetricsDTO.builder()
                .totalStorageInMB(storageLimit)
                .usedStorageInMB(usedStorageInMB)
                .availableStorageInMB(availableStorageInMB)
                .usagePercentage(usagePercentage)
                .build();
    }

    /**
     * Get distribution of file types for a company
     *
     * @param companyId The company ID
     * @return List of file types with their counts and sizes
     */
    public List<FileTypeDistributionDTO> getFileTypeDistribution(Long companyId) {
        log.debug("Calculating file type distribution for company ID: {}", companyId);

        // Raw data: [fileType, documentsOfThisType, totalBytesForThisType]
        List<Object[]> groupedStats = documentRepository.getFileTypeRawDistribution(companyId);

        // Total number of documents across all types
        long totalDocumentCount = groupedStats.stream()
                .mapToLong(row -> (Long) row[1])
                .sum();

        // Convert raw data into DTOs
        return groupedStats.stream().map(row -> {
            String fileType = (String) row[0];
            Long documentsOfThisType = (Long) row[1];
            Long totalSizeInBytes = (Long) row[2];

            float sizeInMB = totalSizeInBytes / (1024.0f * 1024.0f);

            double percentageOfTotal = totalDocumentCount == 0
                    ? 0
                    : (documentsOfThisType * 100.0) / totalDocumentCount;

            return FileTypeDistributionDTO.builder()
                    .fileType(fileType)
                    .count(documentsOfThisType)
                    .sizeInMB(sizeInMB)
                    .percentageOfTotal(percentageOfTotal)
                    .build();
        }).toList();
    }


    /**
     * Count total number of folders for a company
     *
     * @param companyId The company ID
     * @return Total folder count
     */
    public int countTotalFolders(Long companyId) {
        log.debug("Counting folders for company ID: {}", companyId);
        return folderRepository.countByCompanyId(companyId);
    }

    /**
     * Count total number of documents for a company
     *
     * @param companyId The company ID
     * @return Total document count
     */
    public int countTotalDocuments(Long companyId) {
        log.debug("Counting documents for company ID: {}", companyId);
        return documentRepository.countByCompanyId(companyId);
    }

    /**
     * Count total number of employees (non-client users) for a company
     * This method uses direct database queries to avoid loading User objects with roles
     *
     * @param companyId The company ID
     * @return Total employee count
     */
    public int countEmployees(Long companyId) {
        log.debug("Counting employees for company ID: {}", companyId);
        // Use direct database query to avoid loading User objects with roles
        Collection<User> employees = userRepository.findByCompanyIdAndRoleNotIn(companyId, Set.of("CLIENT"));
        return employees.size();
    }

    /**
     * Count total number of clients for a company
     * This method uses direct database queries to avoid loading User objects with roles
     *
     * @param companyId The company ID
     * @return Total client count
     */
    public int countClients(Long companyId) {
        log.debug("Counting clients for company ID: {}", companyId);
        // Use direct database query to avoid loading User objects with roles
        Collection<User> clients = userRepository.findByCompanyIdAndRoleName(companyId, "CLIENT");
        return clients.size();
    }

    /**
     * Get recent user activity for a company
     *
     * @param companyId The company ID
     * @return List of recent user activities
     */
    public List<RecentActivityDTO> getRecentUserActivity(Long companyId) {
        List<DocumentActivityLog> logs = logRepository.findTop20ByCompanyIdOrderByTimestampDesc(companyId);

        return logs.stream().map(log -> {
            User user = userRepository.findById(log.getUserId()).orElse(null);
            return RecentActivityDTO.builder()
                    .userId(log.getUserId())
                    .userName(user != null ? user.getFullName() : "Unknown")
                    .documentName(log.getDocumentName())
                    .actionType(log.getAction())
                    .documentId(log.getDocumentId())
                    .timestamp(log.getTimestamp().toLocalDateTime())
                    .build();
        }).toList();
    }

    /**
     * Get AI processing statistics for a company's documents
     *
     * @param companyId The company ID
     * @return Map of AI processing statistics
     */
    public Map<String, Integer> getAiProcessingStats(Long companyId) {
        log.debug("Getting AI processing stats for company ID: {}", companyId);
        int processedDocs = documentRepository.countByCompanyIdAndAiProcessed(companyId, true);
        int unprocessedDocs = documentRepository.countByCompanyIdAndAiProcessed(companyId, false);

        Map<String, Integer> stats = new HashMap<>();
        stats.put("processed", processedDocs);
        stats.put("unprocessed", unprocessedDocs);
        return stats;
    }

    /**
     * Get storage growth over time for a company
     *
     * @param caller The user requesting the data
     * @param period The time period for data (e.g., "month", "year")
     * @return Map of dates to storage size
     */
    @Transactional(readOnly = true)
    public Map<String, Double> getStorageGrowthOverTime(User caller, String period) {
        if (caller == null) {
            throw new RuntimeException("User not found");
        }

        Long companyId = caller.getCompanyId();
        ZonedDateTime startDate;

        if ("year".equalsIgnoreCase(period)) {
            startDate = ZonedDateTime.now().minusYears(1);
        } else {
            startDate = ZonedDateTime.now().minusMonths(1);
        }


        log.info("Getting storage growth for company ID: {} from {}", companyId, startDate);

        try {
            return documentRepository.getStorageGrowthByCompanyId(companyId, startDate)
                    .stream()
                    .collect(Collectors.toMap(
                            entry -> entry.getDate().toString(),
                            entry -> entry.getSizeInMB()
                    ));
        } catch (Exception e) {
            log.error("Error getting storage growth for company ID: {}", companyId, e);
            throw new RuntimeException("Failed to get storage growth data", e);
        }
    }

    public Map<String, Integer> getRoleDistribution(Long companyId) {
        log.debug("Getting role distribution for company ID: {}", companyId);

        // Direct count query against user_roles join table
        Map<String, Integer> roleDistribution = new HashMap<>();
        roleDistribution.put("SUPER_ADMIN", 0);
        roleDistribution.put("ADMIN", 0);
        roleDistribution.put("VIEWER", 0);
        roleDistribution.put("CLIENT", 0);

        // Get counts directly from database with custom query
        List<Object[]> roleCounts = userRepository.countUsersByRoleAndCompany(companyId);

        for (Object[] result : roleCounts) {
            String roleName = (String) result[0];
            Long count = (Long) result[1];
            roleDistribution.put(roleName, count.intValue());
        }

        return roleDistribution;
    }
}
