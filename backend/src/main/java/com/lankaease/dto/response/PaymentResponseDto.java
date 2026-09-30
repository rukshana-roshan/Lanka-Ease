package com.lankaease.dto.response;

import com.lankaease.entity.enums.PaymentMethod;
import com.lankaease.entity.enums.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentResponseDto(
    Long id,
    String paymentCode,
    Long requestId,
    String requestCode,
    BigDecimal amount,
    PaymentMethod paymentMethod,
    PaymentStatus status,
    String transactionReference,
    LocalDateTime createdAt
) {}
