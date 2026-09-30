package com.lankaease.dto.response;

public record ServiceCategoryResponseDto(
    Long id,
    String name,
    String slug,
    String description,
    String iconName,
    Boolean isActive
) {}
