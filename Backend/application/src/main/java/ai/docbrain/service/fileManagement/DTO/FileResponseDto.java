package ai.docbrain.service.fileManagement.DTO;

import lombok.Data;

@Data
public class FileResponseDto {

        private String message;
        private Long id;
        private Long folderId;
        private String name;
        private String type;
        private byte[] fileData;

        public FileResponseDto(Long id, Long folderId, String fileName, String type, byte[] fileData) {
            this.folderId = folderId;
            this.id = id;
            this.name = fileName;
            this.type = type;
            this.fileData = fileData;
        }


        // Constructor for error response (message only)
        public FileResponseDto(String message) {
            this.message = message;
        }

}
