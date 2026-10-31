package com.lankaease.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Pattern;

public record LoginRequest(
    @Email(message = "Invalid email format")
    String email,

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    String password,

    @Pattern(regexp = "admin", message = "Unsupported username")
    String username
) {
    public LoginRequest(String email, String password) {
        this(email, password, null);
    }

    @AssertTrue(message = "Provide either email or username")
    public boolean isIdentifierValid() {
        boolean hasEmail = email != null && !email.isBlank();
        boolean hasUsername = username != null && !username.isBlank();
        return hasEmail != hasUsername;
    }
}
