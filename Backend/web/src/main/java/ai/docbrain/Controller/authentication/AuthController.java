package ai.docbrain.Controller.authentication;

import ai.docbrain.domain.users.User;
import ai.docbrain.domain.role.Role;
import ai.docbrain.domain.role.Permission;
import ai.docbrain.service.authentication.AuthService;
import ai.docbrain.service.authentication.DTO.*;
import ai.docbrain.service.authentication.exceptions.CompanyExistsException;
import ai.docbrain.service.authentication.exceptions.EmailExistsException;
import ai.docbrain.service.authentication.jwt.TokenBlacklistService;
import ai.docbrain.service.utils.ServerConstants;
import ai.docbrain.service.utils.ServerUtils;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RequestMapping("/api/auth")
@RestController
@AllArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final TokenBlacklistService tokenBlacklistService;
    private final JWTHelper jwtHelper;
    private final UserDetailsService userDetailsService;

    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody SignupRequestDto request) {
        try {
            authService.signUp(request);
            return ResponseEntity.ok(ServerConstants.SIGNUP_SUCCESS);
        } catch (CompanyExistsException e) {
            return ServerUtils.getResponseEntity("Company name already exists", HttpStatus.BAD_REQUEST);
        } catch (EmailExistsException e) {
            return ServerUtils.getResponseEntity(ServerConstants.EMAIL_EXISTS, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Signup failed", e);
            return ServerUtils.getResponseEntity(ServerConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            Date expirationDate = jwtHelper.extractExpiration(token);
            LocalDateTime expiration = expirationDate.toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDateTime();

            tokenBlacklistService.blacklistToken(token, expiration);

            return ServerUtils.getResponseEntity(ServerConstants.LOGOUT_SUCCESS, HttpStatus.OK);
        }
        return ResponseEntity.badRequest().body("Invalid Authorization Header");
    }

    @PostMapping(value = "/confirmaccount")
    public ResponseEntity<?> confirmUserAccount(@RequestBody Map<String, String> requestBody) {
        String ctoken = requestBody.get("ctoken");
        String userEmail = requestBody.get("email");
        return authService.confirmEmail(ctoken, userEmail.toLowerCase());
    }

    @PostMapping("/resend-token")
    public ResponseEntity<String> resendToken(@RequestBody ResendConfirmationRequestDto request) {
        try {
            return authService.resendConfirmationToken(request);
        } catch (Exception e) {
            return ServerUtils.getResponseEntity(ServerConstants.ERROR_SENDING_TOKEN, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequestDto request) {
        try {
            return authService.changePassword(request);
        } catch (Exception e) {
            return ServerUtils.getResponseEntity("An error occurred while changing password", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequestDto request) {
        try {
            return authService.forgotPassword(request);
        } catch (Exception e) {
            return ServerUtils.getResponseEntity(ServerConstants.PSSWORD_RESET_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshAccessToken(@RequestBody Map<String, String> requestMap) {
        String refreshToken = requestMap.get("refreshToken");

        if (refreshToken == null || refreshToken.isEmpty()) {
            return ServerUtils.getResponseEntity(ServerConstants.INVALID_DATA, HttpStatus.BAD_REQUEST);
        }

        if (tokenBlacklistService.isTokenBlacklisted(refreshToken)) {
            return ServerUtils.getResponseEntity(ServerConstants.INVALID_OR_EXPIRED_TOKEN, HttpStatus.UNAUTHORIZED);
        }

        try {
            String username = jwtHelper.getUsername(refreshToken);

            if (!jwtHelper.validateToken(refreshToken)) {
                return ServerUtils.getResponseEntity(ServerConstants.INVALID_OR_EXPIRED_TOKEN, HttpStatus.UNAUTHORIZED);
            }

            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (userDetails == null || !jwtHelper.validateToken(refreshToken, userDetails)) {
                return ServerUtils.getResponseEntity(ServerConstants.INVALID_OR_EXPIRED_TOKEN, HttpStatus.UNAUTHORIZED);
            }

            // Cast UserDetails to your custom User entity
            User user = (User) userDetails;

            // Extract role names
            Set<String> roleNames = user.getRoles().stream()
                    .map(Role::getName) // Assuming Role has a getName() method
                    .collect(Collectors.toSet());

            // Extract permission names
            Set<String> permissionNames = user.getRoles().stream()
                    .flatMap(role -> role.getPermissions().stream()) // Assuming Role has a getPermissions() method
                    .map(Permission::getName) // Assuming Permission has a getName() method
                    .collect(Collectors.toSet());

            // Generate the access token
            String newAccessToken = jwtHelper.generateAccessToken(username, roleNames, permissionNames);
            String newRefreshToken = jwtHelper.generateRefreshToken(username);

            // Blacklist the old refresh token
            LocalDateTime expirationTime = jwtHelper.extractExpiration(refreshToken).toInstant()
                    .atZone(java.time.ZoneId.systemDefault()).toLocalDateTime();
            tokenBlacklistService.blacklistToken(refreshToken, expirationTime);

            // Prepare the response
            Map<String, String> response = new HashMap<>();
            response.put("token", newAccessToken);
            response.put("refreshToken", newRefreshToken);

            return ResponseEntity.ok(response);
        } catch (ExpiredJwtException e) {
            log.warn("Refresh token expired", e);
            String username = e.getClaims().getSubject();
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (userDetails == null || !jwtHelper.validateToken(refreshToken, userDetails)) {
                return ServerUtils.getResponseEntity(ServerConstants.INVALID_OR_EXPIRED_TOKEN, HttpStatus.UNAUTHORIZED);
            }

            // Cast UserDetails to your custom User entity
            User user = (User) userDetails;

            // Extract role names
            Set<String> roleNames = user.getRoles().stream()
                    .map(Role::getName) // Assuming Role has a getName() method
                    .collect(Collectors.toSet());

            // Extract permission names
            Set<String> permissionNames = user.getRoles().stream()
                    .flatMap(role -> role.getPermissions().stream()) // Assuming Role has a getPermissions() method
                    .map(Permission::getName) // Assuming Permission has a getName() method
                    .collect(Collectors.toSet());

            // Generate the access token
            String newAccessToken = jwtHelper.generateAccessToken(username, roleNames, permissionNames);
            String newRefreshToken = jwtHelper.generateRefreshToken(username);

            // Blacklist the old refresh token
            tokenBlacklistService.blacklistToken(refreshToken, LocalDateTime.now());

            // Prepare the response
            Map<String, String> response = new HashMap<>();
            response.put("token", newAccessToken);
            response.put("refreshToken", newRefreshToken);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error during token refresh", e);
            return ServerUtils.getResponseEntity(ServerConstants.ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequestDto request) {
        try {
            return authService.resetPasswordWithPasscode(request);
        } catch (Exception e) {
            return ServerUtils.getResponseEntity(ServerConstants.PSSWORD_RESET_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}