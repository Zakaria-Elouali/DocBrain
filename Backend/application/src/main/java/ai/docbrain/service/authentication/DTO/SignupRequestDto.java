package ai.docbrain.service.authentication.DTO;

import lombok.Data;

@Data
public class SignupRequestDto {

    private String fullName;

    private String username;
    private String email;

    private String companyName;

    private String password;

}
