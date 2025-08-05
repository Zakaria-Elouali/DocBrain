package ai.docbrain.service.authentication.DTO;

import lombok.Data;

@Data
public class ResetPasswordRequestDto {


    private String email;

    private String passcode;

    private String newPassword;

}
