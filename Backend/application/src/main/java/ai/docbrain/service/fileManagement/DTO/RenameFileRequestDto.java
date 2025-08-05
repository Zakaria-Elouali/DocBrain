package ai.docbrain.service.fileManagement.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RenameFileRequestDto {
    private String name; // Changed from newFileName to name to match frontend payload
}
