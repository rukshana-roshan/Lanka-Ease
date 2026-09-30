package com.lankaease.controller;

import com.lankaease.dto.request.PaymentRequestDto;
import com.lankaease.dto.response.PaymentResponseDto;
import com.lankaease.payment.PaymentService;
import com.lankaease.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PaymentResponseDto> processPayment(
            @Valid @RequestBody PaymentRequestDto dto,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(paymentService.processPayment(dto, userPrincipal.getId()));
    }

    @GetMapping("/code/{paymentCode}")
    public ResponseEntity<PaymentResponseDto> getPaymentByCode(@PathVariable String paymentCode) {
        return ResponseEntity.ok(paymentService.getPaymentByCode(paymentCode));
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handlePaymentWebhook(@RequestBody String payload) {
        // Secure server-side webhook handler for PayHere/Stripe
        return ResponseEntity.ok("OK");
    }
}
