package com.lankaease.dto.response;

import java.math.BigDecimal;

public record InvoiceItemDto(
    Long id,
    String description,
    Integer quantity,
    BigDecimal unitPrice,
    BigDecimal totalPrice
) {}
