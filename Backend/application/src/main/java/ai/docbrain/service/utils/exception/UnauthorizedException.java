package ai.docbrain.service.utils.exception;

public class UnauthorizedException extends Throwable {

    public UnauthorizedException(String message) {
        super(message);
    }

    public UnauthorizedException(String message, Throwable cause) {
        super(message, cause);
    }
}
