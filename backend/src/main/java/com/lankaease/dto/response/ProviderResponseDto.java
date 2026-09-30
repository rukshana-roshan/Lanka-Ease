package com.lankaease.dto.response;

import com.lankaease.entity.enums.VerificationStatus;
import java.math.BigDecimal;
import java.util.List;

public record ProviderResponseDto(
    Long id,
    Long userId,
    String fullName,
    String businessName,
    String description,
    Integer experienceYears,
    BigDecimal priceMin,
    BigDecimal priceMax,
    Boolean isVerified,
    VerificationStatus verificationStatus,
    BigDecimal ratingAvg,
    Integer jobsCompletedCount,
    Integer responseTimeMinutes,
    Boolean isAvailable,
    Double currentLatitude,
    Double currentLongitude,
    String profileImage,
    String phone,
    String email,
    List<ServiceCategoryResponseDto> categories,
    List<String> serviceCities
) {}
