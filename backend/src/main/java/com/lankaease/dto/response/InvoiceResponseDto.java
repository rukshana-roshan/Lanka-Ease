package com.lankaease.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record InvoiceResponseDto(
    Long id,
    String invoiceNumber,
    Long requestId,
    String requestCode,
    String customerName,
    String customerPhone,
    String customerAddress,
    String providerName,
    String providerBusinessName,
    String providerPhone,
    BigDecimal labourFee,
    BigDecimal partsFee,
    BigDecimal serviceFee,
    BigDecimal totalAmount,
    String paymentStatus,
    List<InvoiceItemDto> items,
    LocalDateTime createdAt
) {}
