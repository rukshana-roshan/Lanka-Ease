package com.lankaease.dto.request;

import jakarta.validation.constraints.NotBlank;

public record SmartAiRequestDto(
    @NotBlank(message = "Description cannot be blank")
    String problemDescription
) {}
