package ai.docbrain.Controller.authentication;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@RequiredArgsConstructor
@Configuration
class SecurityConfig {

    private final JwtAuthorizationFilter jwtAuthorizationFilter;
    private final JwtFilter jwtFilter;

    /**
     * Configures the security filter chain with HTTP and JWT security settings.
     *
     * @param http the HttpSecurity instance
     * @return the SecurityFilterChain instance
     * @throws Exception if an error occurs
     */
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        configureJwtSecurity(http);
        configureHttpSecurity(http);

        DefaultSecurityFilterChain build = http.build();
        return build;
    }

    /**
     * Configures HTTP security settings, disabling HTTP basic and CSRF, and setting up authorization
     * request matchers.
     *
     * @param http the HttpSecurity instance
     * @throws Exception if an error occurs during configuration
     */
    private void configureHttpSecurity(HttpSecurity http) throws Exception {
        http
                .cors(corsConfigurer -> corsConfigurer.configurationSource(corsConfigurationSource()))
                .httpBasic(AbstractHttpConfigurer::disable)
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/api/auth/login", "/api/auth/signup",
                                "/api/users/forgotPassword", "/api/auth/resetPassword",
                                "api/auth/confirmaccount",
                                "/api/auth/resend-token",
                                "/api/auth/refresh-token",
                                "/api/auth/forgot-password",
                                "/api/auth/reset-password",
                                "/api/data/profilesPics/**",
                                "/api/documents/process/callback",
                                "/swagger-ui/*").permitAll()
                        .requestMatchers("/api/**").authenticated()
                        .requestMatchers("/api/users/admin").hasRole("ADMIN")
                        .anyRequest().permitAll()
                );
    }

    /**
     * Configures JWT security settings by adding the JWT authentication filter, setting up exception
     * handling, and configuring session management.
     *
     * @param http the HttpSecurity instance
     * @throws Exception if an error occurs during configuration
     */
    private void configureJwtSecurity(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth.requestMatchers("/api/auth/login", "/api/auth/signup",
                        "/api/users/forgotPassword", "/api/auth/resetPassword",
                        "api/auth/confirmaccount",
                        "/api/auth/resend-token",
                        "/api/auth/refresh-token",
                        "/api/auth/forgot-password",
                        "/api/auth/reset-password",
                        "/api/data/profilesPics/**",
                        "/api/documents/process/callback",
                        "/swagger-ui/*").permitAll())
                .addFilterAfter(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtAuthorizationFilter, JwtFilter.class)
                .sessionManagement(session -> session.sessionCreationPolicy(STATELESS));
    }

    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("*"));
        configuration.setAllowedMethods(List.of("*"));
        configuration.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

@RequiredArgsConstructor
@Configuration
class AuthenticationConfig {

    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;

    /**
     * Creates and configures a DaoAuthenticationProvider bean.
     *
     * @return the configured DaoAuthenticationProvider instance
     */
    @Bean
    DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(passwordEncoder);
        provider.setUserDetailsService(userDetailsService);
        return provider;
    }

    @Bean
    AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}

@Configuration
class PasswordEncoderConfig {

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
