package com.lankaease.dto.request;

import com.lankaease.entity.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record PaymentRequestDto(
    @NotNull(message = "Request ID is required")
    Long requestId,

    @NotNull(message = "Payment method is required")
    PaymentMethod paymentMethod,

    BigDecimal amount
) {}
