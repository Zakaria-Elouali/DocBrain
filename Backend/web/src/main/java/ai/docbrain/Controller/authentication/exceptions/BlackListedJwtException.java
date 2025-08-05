package ai.docbrain.Controller.authentication.exceptions;

public class BlackListedJwtException extends Exception {

  private final int statusCode;

  // Constructor accepting the status code and message
  public BlackListedJwtException(int statusCode, String message) {
    super(message);
    this.statusCode = statusCode;
  }

  // Constructor for wrapping another exception
  public BlackListedJwtException(Throwable cause) {
    super(cause);
    this.statusCode = 0; // Default status code if not provided
  }

  // Constructor for wrapping another exception with a custom status code
  public BlackListedJwtException(int statusCode, String message, Throwable cause) {
    super(message, cause);
    this.statusCode = statusCode;
  }

  public int getStatusCode() {
    return statusCode;
  }
}
