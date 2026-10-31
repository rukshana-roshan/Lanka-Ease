package com.lankaease.dto.request;

import com.lankaease.entity.enums.RequestStatus;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record UpdateStatusRequestDto(
    @NotNull(message = "New status is required")
    RequestStatus newStatus,
    String notes,
    @jakarta.validation.constraints.PositiveOrZero BigDecimal finalPrice,
    @jakarta.validation.constraints.PositiveOrZero BigDecimal labourFee,
    @jakarta.validation.constraints.PositiveOrZero BigDecimal partsFee,
    String cancelReason
) {}
