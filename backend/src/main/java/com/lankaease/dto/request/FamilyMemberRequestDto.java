package com.lankaease.dto.request;

import com.lankaease.entity.enums.Relationship;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record FamilyMemberRequestDto(
    @NotBlank(message = "Name is required")
    String name,

    @NotNull(message = "Relationship is required")
    Relationship relationship,

    String phone,

    @NotBlank(message = "Address is required")
    String address,

    Double latitude,
    Double longitude
) {}
