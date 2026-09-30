package com.lankaease.dto.request;

import com.lankaease.entity.enums.Urgency;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public record CreateServiceRequestDto(
    @NotBlank(message = "Problem description is required")
    String problemDescription,

    @NotNull(message = "Service category is required")
    Long categoryId,

    Long familyMemberId,
    Long providerId,

    @NotBlank(message = "Service address is required")
    String address,

    Double latitude,
    Double longitude,
    LocalDate preferredDate,
    String preferredTime,
    Urgency urgency,
    String aiSuggestion,
    List<String> mediaUrls,
    Boolean isDraft
) {}
