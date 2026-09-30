package com.lankaease.dto.request;

import com.lankaease.entity.enums.RequestStatus;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record UpdateStatusRequestDto(
    @NotNull(message = "New status is required")
    RequestStatus newStatus,
    String notes,
    BigDecimal finalPrice,
    BigDecimal labourFee,
    BigDecimal partsFee,
    String cancelReason
) {}
