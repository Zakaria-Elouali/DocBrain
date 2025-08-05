package ai.docbrain.service.utils.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class UniqueFieldAlreadyExistException extends DataIntegrityViolationException {

    public UniqueFieldAlreadyExistException(String message) {
        super(message);
    }
}