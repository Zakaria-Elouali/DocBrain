package ai.docbrain.Controller.authentication;

import ai.docbrain.Controller.authentication.exceptions.InvalidAuthorizationException;
import ai.docbrain.Controller.authentication.exceptions.InvalidJwtException;
import ai.docbrain.domain.users.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Set;
import java.util.stream.Collectors;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

import static jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED;
@RequiredArgsConstructor
@Service
final class JwtFilter extends OncePerRequestFilter {

    private final JWTHelper jwtHelper;
    private final UserDetailsService userDetailsService;

    private static final String BEARER_PREFIX = "Bearer ";
    private static final int BEARER_PREFIX_LENGTH = BEARER_PREFIX.length();

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String servletPath = request.getServletPath();

        // List of endpoints to exclude from filtering
        return servletPath.equals("/api/auth/login") ||
                servletPath.equals("/api/auth/signup") ||
                servletPath.equals("/api/users/forgotPassword") ||
                servletPath.equals("/api/auth/resetPassword") ||
                servletPath.equals("/api/auth/confirmaccount") ||
                servletPath.equals("/api/auth/resend-token") ||
                servletPath.equals("/api/auth/refresh-token") ||
                servletPath.equals("/api/auth/forgot-password") ||
                servletPath.equals("/api/auth/reset-password") ||
                servletPath.equals("/api/documents/process/callback") ||
                servletPath.startsWith("/api/data/profilesPics/") ||
                servletPath.startsWith("/swagger-ui/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            processToken(request);
            filterChain.doFilter(request, response);
        } catch (InvalidJwtException e) {
            unauthorized(response, e, "Invalid token. Cause: " + e.getCause().getMessage());
        } catch (InvalidAuthorizationException e) {
            unauthorized(response, e, "Authorization header is missing or invalid.");
            response.setHeader("WWW-Authenticate", "Bearer realm=\"MOROCCO-PT.com\"");
        } catch (UsernameNotFoundException e) {
            unauthorized(response, e, "Authentication failed: User not found.");
        }
    }

    /**
     * Sends a response with a 401 Unauthorized status code and a custom error message.
     *
     * @param response HTTP response.
     * @param e        Cause of the unauthorized status.
     * @param message  Custom error message.
     */
    private void unauthorized(HttpServletResponse response, Exception e, String message)
            throws IOException {
        logger.debug(message, e);
        response.setStatus(SC_UNAUTHORIZED);
        response.getWriter().write(message);
    }

    /**
     * Extracts the token from the Authorization header and performs validations.
     *
     * @param request Incoming HTTP request.
     */
    private void processToken(HttpServletRequest request)
            throws InvalidJwtException, InvalidAuthorizationException {
        String token = getToken(request);
        jwtHelper.validateToken(token);

        String username = jwtHelper.getUsername(token);
        setAuthentication(request, username);
    }

    /**
     * Extracts the JWT token from the Authorization header.
     *
     * @param request Incoming HTTP request.
     * @return Extracted JWT token.
     */
    private String getToken(HttpServletRequest request) throws InvalidAuthorizationException {
        String requestHeader = request.getHeader("Authorization");

        if (requestHeader == null || !requestHeader.startsWith(BEARER_PREFIX)) {
            logger.debug("Invalid Request Header");
            throw new InvalidAuthorizationException("Authorization Header missing or invalid");
        }

        return requestHeader.substring(BEARER_PREFIX_LENGTH);
    }

    /**
     * Sets the authentication in the security context if the user is not already authenticated.
     *
     * @param request  Incoming HTTP request
     * @param username Username extracted from token
     */
    private void setAuthentication(HttpServletRequest request, String username) {
//        System.out.println("=== JwtFilter.setAuthentication ===");
//        System.out.println("Setting authentication for: " + username);

        SecurityContext securityContext = SecurityContextHolder.getContext();

        if (securityContext.getAuthentication() != null) {
            logger.info("User '%s' already authenticated".formatted(securityContext.getAuthentication()
                    .getName()));
//            System.out.println("User already authenticated: " + securityContext.getAuthentication().getName());
//            System.out.println("Authentication: " + securityContext.getAuthentication());
//            System.out.println("Authorities: " + securityContext.getAuthentication().getAuthorities());
            return;
        }

        UserDetails userDetails = getUserDetails(username);
//        System.out.println("Creating authentication token with authorities: " + userDetails.getAuthorities());

        // If the user has no authorities but we know they should have some, get them directly
        if (userDetails instanceof User && userDetails.getAuthorities().isEmpty()) {
            User user = (User) userDetails;
//            System.out.println("User has no authorities, getting them directly from the dB actualy from JWT");

            // Get role and permission names directly from the token
            String token = request.getHeader("Authorization").substring(7);
            Set<String> roleNames = jwtHelper.extractRoles(token);
            Set<String> permissionNames = jwtHelper.extractPermissions(token);

//            System.out.println("Roles from token: " + roleNames);
//            System.out.println("Permissions from token: " + permissionNames);

            if (roleNames != null && !roleNames.isEmpty() && permissionNames != null && !permissionNames.isEmpty()) {
//                System.out.println("Setting roles and authorities directly from token");

                // Set roles directly on the user object
                user.setRolesFromNames(roleNames, permissionNames);
//                System.out.println("Roles set directly on user: " + user.getRoles());

                // Also set authorities directly
                Set<GrantedAuthority> authorities = permissionNames.stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toSet());

                user.setAuthorities(authorities);
//                System.out.println("Authorities set directly on user: " + user.getAuthorities());
            }
        }

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

//        System.out.println("Setting authentication: " + authentication);
//        System.out.println("Authentication authorities: " + authentication.getAuthorities());

        securityContext.setAuthentication(authentication);

//        System.out.println("Authentication set in security context");
    }

    /**
     * Retrieves user details based on the username.
     *
     * @param username Username extracted from token
     * @return Optional containing user details if present
     */
    private UserDetails getUserDetails(String username) {
        try {
//            System.out.println("=== JwtFilter.getUserDetails ===");
//            System.out.println("Loading user details for: " + username);
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
//            System.out.println("User details loaded: " + userDetails);
            return userDetails;
        } catch (UsernameNotFoundException e) {
            logger.warn("Could not find user '%s', but has well formed Token".formatted(username));
            throw e;
        }
    }

}
