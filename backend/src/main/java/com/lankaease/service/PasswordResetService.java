package com.lankaease.service;

import com.lankaease.entity.User;
import com.lankaease.exception.BadRequestException;
import com.lankaease.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import javax.crypto.SecretKey;
import javax.crypto.Mac;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class PasswordResetService {
    private final UserRepository users;
    private final PasswordEncoder passwords;
    private final PasswordResetEmailSender email;
    private final String secret;
    private final String frontend;
    private final Map<Long, Long> sent = new LinkedHashMap<>();

    public PasswordResetService(UserRepository users, PasswordEncoder passwords, PasswordResetEmailSender email,
            @Value("${lankaease.jwt.secret}") String secret,
            @Value("${PASSWORD_RESET_FRONTEND_URL:https://lanka-ease.netlify.app}") String frontend) {
        this.users = users; this.passwords = passwords; this.email = email; this.secret = secret;
        URI origin = URI.create(frontend);
        if (origin.getHost() == null || origin.getRawQuery() != null || origin.getRawFragment() != null
                || origin.getUserInfo() != null || !("https".equals(origin.getScheme())
                || ("http".equals(origin.getScheme()) && Set.of("localhost", "127.0.0.1").contains(origin.getHost()))))
            throw new IllegalArgumentException("PASSWORD_RESET_FRONTEND_URL must be an HTTPS frontend URL");
        this.frontend = frontend.replaceAll("/+$", "");
    }

    public void request(String address) {
        if (!email.isConfigured()) throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
            "Password reset email is not configured. Please contact support.");
        var found = users.findByEmailIgnoreCase(address.trim());
        if (found.isEmpty() || !Boolean.TRUE.equals(found.get().getIsEnabled())) return;
        User user = found.get();
        synchronized (sent) {
            long now = System.currentTimeMillis();
            if (now - sent.getOrDefault(user.getId(), 0L) < 60000) return;
            sent.entrySet().removeIf(entry -> now - entry.getValue() >= 60000);
            if (sent.size() >= 10000) return;
            sent.put(user.getId(), now);
        }
        String token = user.getId() + "." + Jwts.builder().subject(user.getId().toString())
            .claim("purpose", "password-reset").id(UUID.randomUUID().toString())
            .expiration(new Date(System.currentTimeMillis() + 15 * 60 * 1000))
            .signWith(key(user), Jwts.SIG.HS256).compact();
        try { email.send(user.getEmail(), frontend + "/reset-password#token=" + token); }
        catch (IllegalStateException e) {
            // Do not expose account existence or provider responses to the requester.
            org.slf4j.LoggerFactory.getLogger(getClass()).error("Password reset email delivery failed");
        }
    }

    @Transactional
    public void reset(String token, String password) {
        if (password.getBytes(StandardCharsets.UTF_8).length > 72)
            throw new BadRequestException("Choose a password that is at most 72 bytes.");
        try {
            int separator = token.indexOf('.');
            long id = Long.parseLong(token.substring(0, separator));
            User user = users.findForPasswordReset(id).orElseThrow(IllegalArgumentException::new);
            if (!Boolean.TRUE.equals(user.getIsEnabled())) throw new IllegalArgumentException();
            var claims = Jwts.parser().verifyWith(key(user)).build()
                .parseSignedClaims(token.substring(separator + 1)).getPayload();
            if (!"password-reset".equals(claims.get("purpose")) || !user.getId().toString().equals(claims.getSubject()))
                throw new IllegalArgumentException();
            user.setPasswordHash(passwords.encode(password));
            users.saveAndFlush(user);
        } catch (io.jsonwebtoken.JwtException | IllegalArgumentException | IndexOutOfBoundsException e) {
            throw new BadRequestException("This reset link is invalid or expired. Request a new link.");
        }
    }

    private SecretKey key(User user) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)));
            return Keys.hmacShaKeyFor(mac.doFinal(("password-reset:" + user.getPasswordHash()).getBytes(StandardCharsets.UTF_8)));
        } catch (java.security.GeneralSecurityException e) { throw new IllegalStateException(e); }
    }
}
