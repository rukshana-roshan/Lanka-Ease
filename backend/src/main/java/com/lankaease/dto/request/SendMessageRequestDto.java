package com.lankaease.dto.request;

public record SendMessageRequestDto(
    String textContent,
    String mediaUrl
) {}
