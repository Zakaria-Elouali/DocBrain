package ai.docbrain.service.authentication;

import ai.docbrain.domain.BaseEntity;
import ai.docbrain.domain.company.Company;
import ai.docbrain.domain.jwt.ConfirmationToken;
import ai.docbrain.domain.users.User;
import ai.docbrain.service.authentication.DTO.*;

import ai.docbrain.service.authentication.jwt.ConfirmationTokenService;
import ai.docbrain.service.authentication.jwt.IConfirmationTokenRepository;
import ai.docbrain.service.company.CompanyService;

import ai.docbrain.service.user.sendEmail.EmailService;
import ai.docbrain.service.user.IUserRepository;
import ai.docbrain.service.user.UserService;
import ai.docbrain.service.utils.ServerConstants;
import ai.docbrain.service.utils.ServerUtils;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Set;

@Service
@AllArgsConstructor
@Slf4j
public class AuthService {
    private final UserService userService;
    private final CompanyService companyService;
    private IUserRepository userRepository;
    IConfirmationTokenRepository confirmationTokenRepository;
    ConfirmationTokenService tokenService;
    EmailService emailService;

    AuthenticationManager authenticationManager;
    private PasswordEncoder passwordEncoder;

    @Transactional
    public void signUp(SignupRequestDto request) {
        // Create company
        Company company = companyService.createCompany(
                request.getCompanyName(),
                request.getFullName()
        );

        // Create inactive user
        User newUser = userService.createInactiveSuperAdmin(
                request.getFullName(),
                request.getUsername().toLowerCase(),
                request.getEmail().toLowerCase(),
                request.getPassword(),
                company,
                false, // twoFactorEnabled
                true   // notificationsEnabled
        );

//        // Generate and save confirmation token
//        String passcode = tokenService.generateUniquePasscode();
//        ConfirmationToken confirmationToken = new ConfirmationToken(newUser, passcode);
//        confirmationTokenRepository.save(confirmationToken);

        // Send verification email
        userService.sendVerificationEmail(newUser);
    }

    @Transactional
    public ResponseEntity<String> changePassword(ChangePasswordRequestDto request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (!isValidAuthentication(authentication)) {
                return ServerUtils.getResponseEntity(ServerConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }

            User user = userRepository.getUser(authentication.getName());
            if (user == null) {
                return ServerUtils.getResponseEntity(ServerConstants.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            if (request.getOldPassword().equals(request.getNewPassword())) {
                return ServerUtils.getResponseEntity(ServerConstants.PASSWORD_SAME, HttpStatus.BAD_REQUEST);
            }

            if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
                return ServerUtils.getResponseEntity(ServerConstants.OLD_PASSWORD, HttpStatus.BAD_REQUEST);
            }

            updateUserPassword(user, request.getNewPassword());
            userService.sendPasswordChangeConfirmation(user.getEmail(), user.getFullName());

            return ServerUtils.getResponseEntity(ServerConstants.PASSWORD_CHANGED, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error in changePassword: ", e);
            return ServerUtils.getResponseEntity(ServerConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public ResponseEntity<String> forgotPassword(ForgotPasswordRequestDto request) {
        try {
            User user = userRepository.getUser(request.getEmail());
            if (user == null) {
                return ServerUtils.getResponseEntity(ServerConstants.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            String passcode = tokenService.generateUniquePasscode();
            ConfirmationToken token = createPasswordResetToken(user, passcode);
            confirmationTokenRepository.save(token);

            userService.sendPasswordResetEmail(user.getEmail(), passcode);
            return ServerUtils.getResponseEntity(ServerConstants.CHECK_UR_EMAIL_FOR_PASSCODE, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error in forgotPassword: ", e);
            return ServerUtils.getResponseEntity(ServerConstants.PSSWORD_RESET_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public ResponseEntity<String> resetPasswordWithPasscode(ResetPasswordRequestDto request) {
        try {
            ConfirmationToken token = confirmationTokenRepository
                    .findByConfirmationTokenAndUserEmail(request.getPasscode(), request.getEmail());

            if (token == null || token.isExpired()) {
                return ServerUtils.getResponseEntity(ServerConstants.INVALID_OR_EXPIRED_TOKEN, HttpStatus.BAD_REQUEST);
            }

            User user = token.getUser();
            updateUserPassword(user, request.getNewPassword());
            confirmationTokenRepository.delete(token);

            userService.sendPasswordChangeConfirmation(user.getEmail(), user.getFullName());
            return ServerUtils.getResponseEntity(ServerConstants.PASSWORD_RESET_SUCCESS, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error in resetPassword: ", e);
            return ServerUtils.getResponseEntity(ServerConstants.PSSWORD_RESET_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public ResponseEntity<String> resendConfirmationToken(ResendConfirmationRequestDto request) {
        try {
            User user = userRepository.getUser(request.getEmail());
            if (user == null) {
                return ServerUtils.getResponseEntity(ServerConstants.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            if (user.getStatusCode() == BaseEntity.StatusCodes.ACTIVE) {
                return ServerUtils.getResponseEntity(ServerConstants.USER_ALREADY_VERIFIED, HttpStatus.BAD_REQUEST);
            }

//            String newPasscode = tokenService.generateUniquePasscode();
//            ConfirmationToken newToken = createEmailConfirmationToken(user, newPasscode);
//            confirmationTokenRepository.save(newToken);

            userService.sendVerificationEmail(user);
            return ServerUtils.getResponseEntity("Confirmation email has been resent", HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error in resendConfirmationToken: ", e);
            return ServerUtils.getResponseEntity(ServerConstants.ERROR_SENDING_TOKEN, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public ResponseEntity<String> confirmEmail(String confirmationToken, String email) {
        try {
            ConfirmationToken token = confirmationTokenRepository
                    .findByConfirmationTokenAndUserEmail(confirmationToken, email);

            if (token == null || token.isExpired()) {
                return ServerUtils.getResponseEntity(ServerConstants.INVALID_OR_EXPIRED_TOKEN, HttpStatus.BAD_REQUEST);
            }

            User user = token.getUser();
            if (user.getStatusCode() == BaseEntity.StatusCodes.ACTIVE) {
                return ServerUtils.getResponseEntity(ServerConstants.USER_ALREADY_VERIFIED, HttpStatus.BAD_REQUEST);
            }

            user.setStatusCode(BaseEntity.StatusCodes.ACTIVE);
            userRepository.save(user, user.getFullName());
            confirmationTokenRepository.delete(token);
            userService.sendWelcomeEmailToSuperAdmin(user.getEmail());

            return ServerUtils.getResponseEntity(ServerConstants.EMAIL_VERIFIED, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error in confirmEmail: ", e);
            return ServerUtils.getResponseEntity(ServerConstants.INVALID_TOKEN, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Helper methods remain the same but return void instead of throwing exceptions
    private void updateUserPassword(User user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user, user.getFullName());
    }

    private boolean isValidAuthentication(Authentication authentication) {
        return authentication != null &&
                authentication.isAuthenticated() &&
                !"anonymousUser".equals(authentication.getName());
    }

    private ConfirmationToken createPasswordResetToken(User user, String passcode) {
        ConfirmationToken token = new ConfirmationToken(user, passcode);
        token.setExpiryDate(Date.from(Instant.now().plus(15, ChronoUnit.MINUTES)));
        return token;
    }

    private ConfirmationToken createEmailConfirmationToken(User user, String passcode) {
        return new ConfirmationToken(user, passcode);
    }
}