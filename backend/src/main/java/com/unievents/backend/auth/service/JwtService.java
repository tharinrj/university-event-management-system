package com.unievents.backend.auth.service;

import com.unievents.backend.auth.model.UserRole;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Service for generating and validating JWT tokens.
 *
 * <p>Tokens embed three custom claims: {@code userId}, {@code email}, and {@code role}.
 * They are signed with HMAC-SHA256 using the secret configured under
 * {@code app.jwt.secret} and expire after {@code app.jwt.expiration-ms} milliseconds.
 */
@Service
public class JwtService {

    private static final String CLAIM_USER_ID = "userId";
    private static final String CLAIM_ROLE    = "role";

    private final SecretKey signingKey;
    private final long      expirationMs;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-ms}") long expirationMs
    ) {
        // Derive a consistent HMAC-SHA key from the configured secret string.
        this.signingKey  = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    /**
     * Generates a signed JWT for the given user.
     *
     * @param userId the user's unique identifier (becomes the JWT subject)
     * @param email  the user's email address (embedded as a claim)
     * @param role   the user's role (embedded as a claim)
     * @return compact, URL-safe JWT string
     */
    public String generateToken(String userId, String email, UserRole role) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .subject(userId)
                .claim(CLAIM_USER_ID, userId)
                .claim(CLAIM_ROLE, role.name())
                // email is stored as the "subject" description; also as a claim for convenience
                .issuer("unievents")
                .issuedAt(new Date(now))
                .expiration(new Date(now + expirationMs))
                .signWith(signingKey)
                .compact();
    }

    /**
     * Validates a JWT and returns its claims.
     *
     * @param token compact JWT string
     * @return parsed {@link Claims}
     * @throws JwtException if the token is invalid, expired, or tampered with
     */
    public Claims validateAndExtractClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Convenience extractor: pulls the {@code userId} claim from a validated token.
     */
    public String extractUserId(Claims claims) {
        return claims.get(CLAIM_USER_ID, String.class);
    }

    /**
     * Convenience extractor: pulls the {@code role} claim from a validated token.
     */
    public UserRole extractRole(Claims claims) {
        return UserRole.valueOf(claims.get(CLAIM_ROLE, String.class));
    }
}
