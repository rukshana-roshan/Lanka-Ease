package com.lankaease.dto.response;

public record JwtAuthResponse(
    String accessToken,
    String refreshToken,
    String tokenType,
    UserResponseDto user
) {
    public JwtAuthResponse(String accessToken, String refreshToken, UserResponseDto user) {
        this(accessToken, refreshToken, "Bearer", user);
    }
}
