package ai.docbrain.service.user.DTO;


import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Builder
@Data
public class ProfileResponseDto {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String jobTitle;
    private Date dateOfBirth;
    private String profilePicture;
    private Boolean twoFactorEnabled;
    private Boolean notificationsEnabled;

}