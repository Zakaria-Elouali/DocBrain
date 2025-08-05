package ai.docbrain.service.authentication.DTO;

import lombok.Data;

@Data
public class ChangePasswordRequestDto {

    private String oldPassword;
    private String newPassword;

}
