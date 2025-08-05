package ai.docbrain.service.dashboard.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecentActivityDTO {
    private Long userId;
    private String userName;
    private String actionType;
    private String documentName;
    private Long documentId;
    private LocalDateTime timestamp;
}

