package ai.docbrain.service.utils.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    public static final String CUSTOMER_NOT_FOUND = "Customer not found with id: ";

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
