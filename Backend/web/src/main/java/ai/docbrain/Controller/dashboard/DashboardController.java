package ai.docbrain.Controller.dashboard;

import ai.docbrain.domain.users.User;
import ai.docbrain.service.dashboard.DTO.*;
import ai.docbrain.service.dashboard.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for managing dashboard-related operations
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dashboard")
@Log4j2
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * GET /api/dashboard/overview : Get comprehensive dashboard overview
     *
     * @param caller the current authenticated user
     * @return the DashboardOverviewDTO with HTTP status 200 (OK)
     * Returns a complete overview of company's storage, files, and user statistics
     */
    @GetMapping("/overview")
    public ResponseEntity<DashboardOverviewDTO> getDashboardOverview(@ModelAttribute("caller") User caller) {
        log.info("REST request to get dashboard overview for user ID: {}", caller.getId());
        DashboardOverviewDTO overview = dashboardService.getDashboardOverview(caller);
        return ResponseEntity.ok(overview);
    }

    /**
     * GET /api/dashboard/storage-metrics : Get company storage metrics
     *
     * @param caller the current authenticated user
     * @return the CompanyStorageMetricsDTO with HTTP status 200 (OK)
     * Returns metrics about company's storage usage
     */
    @GetMapping("/storage-metrics")
    public ResponseEntity<CompanyStorageMetricsDTO> getStorageMetrics(@ModelAttribute("caller") User caller) {
        log.info("REST request to get storage metrics for user ID: {}", caller.getId());
        CompanyStorageMetricsDTO metrics = dashboardService.getCompanyStorageMetrics(caller.getCompanyId());
        return ResponseEntity.ok(metrics);
    }

    /**
     * GET /api/dashboard/file-type-distribution : Get file type distribution
     *
     * @param caller the current authenticated user
     * @return the List of FileTypeDistributionDTO with HTTP status 200 (OK)
     * Returns distribution of file types across the company
     */
    @GetMapping("/file-type-distribution")
    public ResponseEntity<List<FileTypeDistributionDTO>> getFileTypeDistribution(@ModelAttribute("caller") User caller) {
        log.info("REST request to get file type distribution for user ID: {}", caller.getId());
        List<FileTypeDistributionDTO> distribution = dashboardService.getFileTypeDistribution(caller.getCompanyId());
        return ResponseEntity.ok(distribution);
    }

    /**
     * GET /api/dashboard/document-count : Get total document count
     *
     * @param caller the current authenticated user
     * @return the document count with HTTP status 200 (OK)
     * Returns the total number of documents for the company
     */
    @GetMapping("/document-count")
    public ResponseEntity<Integer> getDocumentCount(@ModelAttribute("caller") User caller) {
        log.info("REST request to get document count for user ID: {}", caller.getId());
        int count = dashboardService.countTotalDocuments(caller.getCompanyId());
        return ResponseEntity.ok(count);
    }

    /**
     * GET /api/dashboard/folder-count : Get total folder count
     *
     * @param caller the current authenticated user
     * @return the folder count with HTTP status 200 (OK)
     * Returns the total number of folders for the company"
     */
    @GetMapping("/folder-count")
    public ResponseEntity<Integer> getFolderCount(@ModelAttribute("caller") User caller) {
        log.info("REST request to get folder count for user ID: {}", caller.getId());
        int count = dashboardService.countTotalFolders(caller.getCompanyId());
        return ResponseEntity.ok(count);
    }

    /**
     * GET /api/dashboard/user-counts : Get employee and client counts
     *
     * @param caller the current authenticated user
     * @return the map with employee and client counts with HTTP status 200 (OK)
     * Returns the counts of employees and clients for the company
     */
    @GetMapping("/user-counts")
    public ResponseEntity<Map<String, Integer>> getUserCounts(@ModelAttribute("caller") User caller) {
        log.info("REST request to get user counts for user ID: {}", caller.getId());
        Long companyId = caller.getCompanyId();
        Map<String, Integer> counts = Map.of(
                "employees", dashboardService.countEmployees(companyId),
                "clients", dashboardService.countClients(companyId)
        );
        return ResponseEntity.ok(counts);
    }

    /**
     * GET /api/dashboard/role-distribution : Get role distribution
     *
     * @param caller the current authenticated user
     * @return the map with role counts with HTTP status 200 (OK)
     * Returns the distribution of users across different roles
     */
    @GetMapping("/role-distribution")
    public ResponseEntity<Map<String, Integer>> getRoleDistribution(@ModelAttribute("caller") User caller) {
        log.info("REST request to get role distribution for user ID: {}", caller.getId());
        Map<String, Integer> distribution = dashboardService.getRoleDistribution(caller.getCompanyId());
        return ResponseEntity.ok(distribution);
    }

    /**
     * GET /api/dashboard/recent-activity : Get recent user activity
     *
     * @param caller the current authenticated user
     * @return the list of UserActivityDTO with HTTP status 200 (OK)
     * Returns recent user activities within the company
     */
    @GetMapping("/recent-activity")
    public ResponseEntity<List<RecentActivityDTO >> getRecentActivity(@ModelAttribute("caller") User caller) {
        log.info("REST request to get recent activity for user ID: {}", caller.getId());
        List<RecentActivityDTO> activity = dashboardService.getRecentUserActivity(caller.getCompanyId());
        return ResponseEntity.ok(activity);
    }

    /**
     * GET /api/dashboard/ai-processing-stats : Get AI processing statistics
     *
     * @param caller the current authenticated user
     * @return the map with AI processing stats with HTTP status 200 (OK)
     * Returns statistics about AI-processed documents
     */
    @GetMapping("/ai-processing-stats")
    public ResponseEntity<Map<String, Integer>> getAiProcessingStats(@ModelAttribute("caller") User caller) {
        log.info("REST request to get AI processing stats for user ID: {}", caller.getId());
        Map<String, Integer> stats = dashboardService.getAiProcessingStats(caller.getCompanyId());
        return ResponseEntity.ok(stats);
    }

    /**
     * GET /api/dashboard/storage-growth : Get storage growth over time
     *
     * @param caller the current authenticated user
     * @param period the time period (month or year)
     * @return the map with dates and storage sizes with HTTP status 200 (OK)
     * Returns storage growth data over the specified time period
     */
    @GetMapping("/storage-growth")
    public ResponseEntity<Map<String, Double>> getStorageGrowth(
            @ModelAttribute("caller") User caller,
            @RequestParam(defaultValue = "month") String period) {

        log.info("REST request to get storage growth for user ID: {} and period: {}",
                caller.getId(), period);

        Map<String, Double> growthData = dashboardService.getStorageGrowthOverTime(caller, period);
        return ResponseEntity.ok(growthData);
    }
}
