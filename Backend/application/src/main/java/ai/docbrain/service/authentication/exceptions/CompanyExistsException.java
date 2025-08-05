package ai.docbrain.service.authentication.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Custom Exceptions
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class CompanyExistsException extends RuntimeException {
  public CompanyExistsException(String message) {
    super(message);
  }
}
