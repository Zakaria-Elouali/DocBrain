package ai.docbrain.service.fileManagement.DTO;

import java.util.List;
// Helper class for response
public class UploadResponse {
    private List<String> successMessages;
    private List<String> errorMessages;

    public UploadResponse(List<String> successMessages, List<String> errorMessages) {
        this.successMessages = successMessages;
        this.errorMessages = errorMessages;
    }

    // Getters and setters
    public List<String> getSuccessMessages() { return successMessages; }
    public void setSuccessMessages(List<String> successMessages) { this.successMessages = successMessages; }
    public List<String> getErrorMessages() { return errorMessages; }
    public void setErrorMessages(List<String> errorMessages) { this.errorMessages = errorMessages; }
}
