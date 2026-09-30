package com.lankaease.dto.response;

import com.lankaease.entity.enums.Relationship;
import java.time.LocalDateTime;

public record FamilyMemberResponseDto(
    Long id,
    String name,
    Relationship relationship,
    String phone,
    String address,
    Double latitude,
    Double longitude,
    LocalDateTime createdAt
) {}
