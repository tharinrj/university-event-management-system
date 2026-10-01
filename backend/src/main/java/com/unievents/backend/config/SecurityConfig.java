package com.unievents.backend.config;

import com.unievents.backend.auth.filter.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Security configuration for the application.
 *
 * <p>Route protection rules:
 * <ul>
 *   <li>{@code POST /api/auth/**}                    – public (signup, login)</li>
 *   <li>{@code GET  /api/events, /api/events/**}     – public (browse events)</li>
 *   <li>{@code GET  /api/health}                     – public (health check)</li>
 *   <li>{@code POST/PUT/DELETE /api/events}          – ORGANIZER or ADMIN only</li>
 *   <li>{@code POST/DELETE /api/events/*\/register}  – any authenticated user</li>
 *   <li>{@code GET  /api/users/**}                   – any authenticated user</li>
 *   <li>Everything else                              – authenticated</li>
 * </ul>
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    /**
     * Configures the security filter chain.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                // ── Public endpoints ──────────────────────────────────────────
                .requestMatchers(HttpMethod.POST, "/api/auth/signup", "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.GET,  "/api/health").permitAll()
                .requestMatchers(HttpMethod.GET,  "/api/events", "/api/events/**").permitAll()

                // ── Event mutations – ORGANIZER or ADMIN only ─────────────────
                .requestMatchers(HttpMethod.POST,   "/api/events").hasAnyRole("ORGANIZER", "ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/api/events/**").hasAnyRole("ORGANIZER", "ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/events/**").hasAnyRole("ORGANIZER", "ADMIN")

                // ── Registration endpoints – any authenticated user ───────────
                .requestMatchers("/api/events/*/register").authenticated()
                .requestMatchers("/api/events/*/registration-status").authenticated()

                // ── User-scoped endpoints – any authenticated user ────────────
                .requestMatchers("/api/users/**").authenticated()

                // ── Fallback ─────────────────────────────────────────────────
                .anyRequest().authenticated()
            )
            .httpBasic(httpBasic -> httpBasic.disable())
            .formLogin(formLogin -> formLogin.disable())
            // Insert JWT filter before Spring's built-in username/password filter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Creates a PasswordEncoder bean using BCrypt.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
