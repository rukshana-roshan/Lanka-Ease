package com.lankaease.dto.response;

import java.util.List;

public record SmartAiResponseDto(
    String suggestedCategoryName,
    Long suggestedCategoryId,
    String categorySlug,
    List<String> clarifyingQuestions,
    String summary,
    String disclaimer
) {}
