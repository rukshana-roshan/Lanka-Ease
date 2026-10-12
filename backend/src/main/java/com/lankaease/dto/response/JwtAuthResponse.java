package com.lankaease.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public record JwtAuthResponse(
    String accessToken,
    String refreshToken,
    String tokenType,
    UserResponseDto user
) {
    public JwtAuthResponse(String accessToken, String refreshToken, UserResponseDto user) {
        this(accessToken, refreshToken, "Bearer", user);
    }

    @JsonProperty("token")
    public String token() {
        return accessToken;
    }
}
