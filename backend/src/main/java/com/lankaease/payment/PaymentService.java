package com.lankaease.payment;

import com.lankaease.dto.request.PaymentRequestDto;
import com.lankaease.dto.response.PaymentResponseDto;

public interface PaymentService {
    PaymentResponseDto processPayment(PaymentRequestDto requestDto, Long customerId);
    PaymentResponseDto getPaymentByCode(String paymentCode);
    PaymentResponseDto getPaymentByRequestId(Long requestId);
}
