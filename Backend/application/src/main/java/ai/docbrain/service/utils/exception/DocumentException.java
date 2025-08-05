package ai.docbrain.service.utils.exception;

import java.io.IOException;

public class DocumentException extends IOException {
    private static final long serialVersionUID = 1L;

    public DocumentException(String message) {
        super(message);
    }

    public DocumentException(String message, Throwable cause) {
        super(message, cause);
    }

    public DocumentException(Throwable cause) {
        super(cause);
    }

    public DocumentException() {
        super("An error occurred while processing the document.");
    }
}
