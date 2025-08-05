package ai.docbrain.Controller.authentication;

import ai.docbrain.Controller.authentication.exceptions.InactiveUserException;
import ai.docbrain.domain.BaseEntity;
import ai.docbrain.service.user.UserService;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;

import ai.docbrain.domain.users.User;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Set;


@RequiredArgsConstructor
@Component
final class JwtAuthorizationFilter extends UsernamePasswordAuthenticationFilter {
    private static final Logger log = LoggerFactory.getLogger(JwtAuthorizationFilter.class);

    private static final String AUTHENTICATION_URL = "/api/auth/login";

    private final JWTHelper jwtHelper;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    @Value("${app.uploads.profilesBaseLink}")
    private String profilesBaseLink;

    /**
     * Configures the authentication manager and sets the endpoint for processing authentication   *
     * requests.
     */
    @PostConstruct
    public void init () {
        setAuthenticationManager(authenticationManager);
        setFilterProcessesUrl(AUTHENTICATION_URL);
    }
    /**
     * Processes authentication requests, validates credentials, and generates a JWT token upon
     * successful authentication.
     *
     * @param request  Incoming HTTP request
     * @param response HTTP response
     * @return Authentication object containing user details
     * @throws AuthenticationException if authentication fails
     */
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request,
                                                HttpServletResponse response) throws AuthenticationException {
        try {
            // Check if the request is JSON
            if (request.getContentType() != null && request.getContentType().contains("application/json")) {
                // Read JSON data
                ObjectMapper mapper = new ObjectMapper();
                LoginRequest loginRequest = mapper.readValue(request.getInputStream(), LoginRequest.class);

                String username = loginRequest.username();
                String password = loginRequest.password();

                if (username == null) {
                    log.debug("Attempting to authenticate null username from JSON");
                    username = "";
                }

                if (password == null) {
                    password = "";
                }

                username = username.trim();

                UsernamePasswordAuthenticationToken authRequest =
                        new UsernamePasswordAuthenticationToken(username.toLowerCase(), password);

                setDetails(request, authRequest);

                return this.getAuthenticationManager().authenticate(authRequest);
            }

            // Fall back to form data processing
            String username = obtainUsername(request);
            String password = obtainPassword(request);

            if (username == null) {
                log.debug("Attempting to authenticate null username from form data");
                username = "";
            }

            if (password == null) {
                password = "";
            }

            username = username.trim();

            UsernamePasswordAuthenticationToken authRequest =
                    new UsernamePasswordAuthenticationToken(username.toLowerCase(), password);

            setDetails(request, authRequest);

            return this.getAuthenticationManager().authenticate(authRequest);

        } catch (IOException e) {
            throw new RuntimeException("Error processing authentication request", e);
        }
    }

    /**
     * Handles successful user authentication by generating a JSON Web Token (JWT) and sending it in
     * the HTTP response. This method is called when a user has been successfully authenticated.
     *
     * @param request        The incoming HTTP request from the client.
     * @param response       The HTTP response that will be sent back to the client.
     * @param chain          The filter chain that can be used to pass the request to the next entity
     *                       in the chain.
     * @param authentication An object containing the authentication details of the user.
     * @throws IOException If an error occurs while writing the JWT to the response.
     */
    @Override
    protected void successfulAuthentication (HttpServletRequest request, HttpServletResponse response,
                                             FilterChain chain, Authentication authentication)
            throws IOException,
            InactiveUserException {

        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        String authorizationResponse = createAuthorizationResponse(username);
        PrintWriter writer = response.getWriter();
        writer.write(authorizationResponse);
        writer.flush();
    }

    /**
     * Creates the authorization response containing the JWT and user details.
     *
     * @param username The username of the authenticated user.
     * @return A string representation of the authorization result in JSON format.
     */
    private String createAuthorizationResponse(String username) throws InactiveUserException {
        try {

            User user = userService.getUser(username.toLowerCase());

            if (user.getStatusCode() == null || user.getStatusCode() == BaseEntity.StatusCodes.INACTIVE) {
                userService.sendVerificationEmail(user);
                throw new InactiveUserException("Please verify your email!");
            }

            // Get just the names directly from the database
            Set<String> roleNames = userService.getUserRoleNames(username);
            Set<String> permissions = userService.getUserPermissionNames(username);

//            System.out.println("Roles from direct query: " + roleNames);
//            System.out.println("Permissions from direct query: " + permissions);

            // Generate tokens with roles and permissions
            String token = jwtHelper.generateAccessToken(username, roleNames, permissions);
            String refreshToken = jwtHelper.generateRefreshToken(username);

//            preparing the profile picture path
            String PicturePath = null;
            if (user.getProfilePicture() != null) {
                PicturePath = profilesBaseLink +"/"+ user.getProfilePicture();
            }

            // Create authorization details using the record constructor
            AuthorizationDetails authorizationDetails = new AuthorizationDetails(
                    token,
                    refreshToken,
                    user.getFullName(),
                    roleNames,
                    permissions,
                    user.getEmail(),
                    PicturePath,
                    user.getTwoFactorEnabled()
            );

            return convertToJsonString(authorizationDetails);
        } catch (InactiveUserException e) {
            // Re-throw the exception since it's specific and expected
            throw e;
        } catch (RuntimeException e) {
            // Handle unexpected runtime exceptions
            System.err.println("Error occurred while creating authorization response: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Unable to create authorization response due to an unexpected error.");
        }
    }


    /**
     * Converts the authorization details object to a JSON string.
     *
     * @param result The authorization details to be converted.
     * @return A JSON string representation of the authorization details.
     */
    @SneakyThrows
    private String convertToJsonString (AuthorizationDetails result) {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, true);

        return objectMapper.writeValueAsString(result);
    }

    /**
     * A record that holds the details to be included in the authorization response.
     */
    private record AuthorizationDetails(String token, String refreshToken, String fullName, Set<String> roles, Set<String> permissions, String email, String profilePicture, Boolean twoFactorEnabled) {
    }

    /**
     * using it for handling login request with json and also keep handling it with form-data.
     */
    private record LoginRequest(String username, String password) {
    }

}
