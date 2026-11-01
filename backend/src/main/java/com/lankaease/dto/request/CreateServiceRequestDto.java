package com.lankaease.dto.request;

import com.lankaease.entity.enums.Urgency;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public record CreateServiceRequestDto(
    @NotBlank(message = "Problem description is required")
    @jakarta.validation.constraints.Size(max=5000) String problemDescription,

    @NotNull(message = "Service category is required")
    Long categoryId,

    Long familyMemberId,
    Long providerId,

    @NotBlank(message = "Service address is required")
    @jakarta.validation.constraints.Size(max=3000) String address,

    Double latitude,
    Double longitude,
    @jakarta.validation.constraints.FutureOrPresent(message = "Choose today or a future date") LocalDate preferredDate,
    @jakarta.validation.constraints.Size(max=50) String preferredTime,
    Urgency urgency,
    String aiSuggestion,
    List<String> mediaUrls,
    Boolean isDraft,
    Long serviceId
) {}
