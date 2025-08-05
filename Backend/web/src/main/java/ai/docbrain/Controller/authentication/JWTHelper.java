package ai.docbrain.Controller.authentication;

import ai.docbrain.service.authentication.jwt.TokenBlacklistService;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.*;
import java.util.function.Function;

@RequiredArgsConstructor
@Service
public class JWTHelper {
    private static final Logger log = LoggerFactory.getLogger(JWTHelper.class);

//    @Value("${jwt.secret}")
//    private String secretString;

    @Value("${jwt.refresh-token.expiration}")
    private long refreshTokenExpiration;

    @Value("${jwt.access-token.expiration}")
    private long accessTokenExpiration;

    private final TokenBlacklistService tokenBlacklistService;
    private final JWTsecretKeyStorageService jwtsecretKeyStorageService;

//    private SecretKey getSigningKey() {
//        return Keys.hmacShaKeyFor(secretString.getBytes(StandardCharsets.UTF_8));
//    }

    private SecretKey getSigningKey() {
        return jwtsecretKeyStorageService.getStoredKey();
    }

    public String generateAccessToken(String username, Set<String> roles, Set<String> permissions) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles);
        claims.put("permissions", permissions);
        claims.put("tokenType", "ACCESS");
        return createToken(claims, username, accessTokenExpiration);
    }

    public String generateRefreshToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("tokenType", "REFRESH");
        return createToken(claims, username, refreshTokenExpiration);
    }

    private String createToken(Map<String, Object> claims, String subject, long expirationTime) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + expirationTime);

        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(now)
                .expiration(expiration)
                .id(UUID.randomUUID().toString())
                .signWith(getSigningKey(), Jwts.SIG.HS512)
                .compact();
    }

    public Set<String> extractRoles(String token) {
        Claims claims = getAllClaims(token);
        if (claims == null) {
            return new HashSet<>();
        }
        List<String> roles = claims.get("roles", List.class);
        return roles != null ? new HashSet<>(roles) : new HashSet<>();
    }

    public Set<String> extractPermissions(String token) {
        Claims claims = getAllClaims(token);
        if (claims == null) {
            return new HashSet<>();
        }
        List<String> permissions = claims.get("permissions", List.class);
        return permissions != null ? new HashSet<>(permissions) : new HashSet<>();
    }

    public String getUsername(String token) {
        Claims claims = getAllClaims(token);
        return claims != null ? claims.getSubject() : null;
    }

    public String getTokenId(String token) {
        Claims claims = getAllClaims(token);
        return claims != null ? claims.getId() : null;
    }

    public Date extractExpiration(String token) {
        Claims claims = getAllClaims(token);
        return claims != null ? claims.getExpiration() : null;
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = getAllClaims(token);
        return claims != null ? claimsResolver.apply(claims) : null;
    }

    public Claims getAllClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (JwtException e) {
            log.error("Failed to parse JWT claims: {}", e.getMessage());
            return null;
        }
    }

    public boolean validateToken(String token) {
        if (tokenBlacklistService.isTokenBlacklisted(token)) {
            log.error("Token is blacklisted");
            return false;
        }

        Claims claims = getAllClaims(token);
        if (claims == null) {
            return false;
        }

        Date expiration = claims.getExpiration();
        if (expiration != null && expiration.before(new Date())) {
            log.error("Expired JWT token");
            return false;
        }

        return true;
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        String username = getUsername(token);
        if (username == null || !validateToken(token)) {
            return false;
        }
        return username.equals(userDetails.getUsername());
    }

    public boolean isAccessToken(String token) {
        Claims claims = getAllClaims(token);
        return claims != null && "ACCESS".equals(claims.get("tokenType"));
    }

    public boolean isRefreshToken(String token) {
        Claims claims = getAllClaims(token);
        return claims != null && "REFRESH".equals(claims.get("tokenType"));
    }
}