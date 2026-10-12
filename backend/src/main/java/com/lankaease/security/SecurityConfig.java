package com.lankaease.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Value("${lankaease.cors.allowed-origins:https://lanka-ease.netlify.app,https://*.netlify.app,http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173}")
    private String allowedOrigins;

    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtAuthenticationEntryPoint unauthorizedHandler;

    public SecurityConfig(JwtTokenProvider tokenProvider,
                          CustomUserDetailsService customUserDetailsService,
                          JwtAuthenticationEntryPoint unauthorizedHandler) {
        this.tokenProvider = tokenProvider;
        this.customUserDetailsService = customUserDetailsService;
        this.unauthorizedHandler = unauthorizedHandler;
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(tokenProvider, customUserDetailsService);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Allow CORS preflight requests across all endpoints
                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()

                // Root, health checks, error dispatch, WebSocket, uploads, and API documentation
                .requestMatchers(
                    "/",
                    "/api",
                    "/health",
                    "/error",
                    "/actuator/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/api-docs/**",
                    "/v3/api-docs/**",
                    "/h2-console/**",
                    "/uploads/**",
                    "/ws-lankaease/**"
                ).permitAll()

                // Public authentication & registration endpoints
                .requestMatchers("/api/auth/**").permitAll()

                // Public contact form submission
                .requestMatchers("/api/contact/**").permitAll()

                // Public service categories browsing (admin CRUD is protected by @PreAuthorize)
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/services/**").permitAll()

                // Public provider browsing (search, nearby, details; /me and availability require PROVIDER)
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/providers").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/providers/nearby").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/providers/{id}").permitAll()

                // Public service request tracking lookup by ID or Code
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/requests/{id}").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/requests/code/**").permitAll()

                // Public provider reviews lookup
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/reviews/provider/**").permitAll()

                // Public payment webhooks (PayHere/Stripe) and verification by code
                .requestMatchers("/api/payments/webhook").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/payments/code/**").permitAll()

                // Public AI assistance endpoints
                .requestMatchers("/api/ai/**").permitAll()

                // Role-based restricted endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/provider/**").hasAnyRole("PROVIDER", "ADMIN")
                .requestMatchers("/api/customer/**").hasAnyRole("CUSTOMER", "ADMIN")

                // All other endpoints require valid authentication
                .anyRequest().authenticated()
            );

        // Required for H2 Console frame display in browser
        http.headers(headers -> headers.frameOptions(frame -> frame.disable()));

        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
        configuration.setAllowedOriginPatterns(origins.isEmpty() ? List.of("*") : origins);
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
