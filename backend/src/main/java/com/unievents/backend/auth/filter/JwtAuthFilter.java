package com.unievents.backend.auth.filter;

import com.unievents.backend.auth.model.UserRole;
import com.unievents.backend.auth.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Servlet filter that intercepts every request and, if a valid JWT is present
 * in the {@code Authorization: Bearer <token>} header, authenticates the request
 * in the Spring Security context.
 *
 * <p>Requests without a token, or with an invalid/expired token, are allowed to
 * continue unauthenticated — the downstream {@link org.springframework.security.web.SecurityFilterChain}
 * will reject them if the requested route requires authentication.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX         = "Bearer ";

    private final JwtService jwtService;

    public JwtAuthFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader(AUTHORIZATION_HEADER);

        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            // No JWT present – continue unauthenticated
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(BEARER_PREFIX.length());

        try {
            Claims claims = jwtService.validateAndExtractClaims(token);
            String  userId = jwtService.extractUserId(claims);
            UserRole role  = jwtService.extractRole(claims);

            // Build a Spring Security authentication principal
            var grantedAuthority = new SimpleGrantedAuthority("ROLE_" + role.name());
            var authentication = new UsernamePasswordAuthenticationToken(
                    userId,        // principal  – use userId as the identity
                    null,          // credentials – not needed after validation
                    List.of(grantedAuthority)
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (JwtException | IllegalArgumentException ex) {
            // Token is invalid or expired – clear any stale context and let the
            // filter chain continue; the security rules will return 401.
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}
