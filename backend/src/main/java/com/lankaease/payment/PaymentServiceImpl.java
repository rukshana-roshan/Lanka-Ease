package com.lankaease.payment;

import com.lankaease.dto.request.PaymentRequestDto;
import com.lankaease.dto.response.PaymentResponseDto;
import com.lankaease.entity.*;
import com.lankaease.entity.enums.PaymentStatus;
import com.lankaease.entity.enums.RequestStatus;
import com.lankaease.exception.BadRequestException;
import com.lankaease.exception.ResourceNotFoundException;
import com.lankaease.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class PaymentServiceImpl implements PaymentService {

    @org.springframework.beans.factory.annotation.Value("${lankaease.payment.mock-enabled:false}")
    private boolean mockEnabled;
    private final PaymentRepository paymentRepository;
    private final ServiceRequestRepository requestRepository;
    private final InvoiceRepository invoiceRepository;
    private final UserRepository userRepository;

    public PaymentServiceImpl(PaymentRepository paymentRepository,
                              ServiceRequestRepository requestRepository,
                              InvoiceRepository invoiceRepository,
                              UserRepository userRepository) {
        this.paymentRepository = paymentRepository;
        this.requestRepository = requestRepository;
        this.invoiceRepository = invoiceRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public PaymentResponseDto processPayment(PaymentRequestDto requestDto, Long customerId) {
        ServiceRequest request = requestRepository.findById(requestDto.requestId())
                .orElseThrow(() -> new ResourceNotFoundException("ServiceRequest", "id", requestDto.requestId()));

        com.lankaease.security.ResourceAccess.requireRequest(request);
        if (!request.getCustomer().getId().equals(customerId)) {
            throw new org.springframework.security.access.AccessDeniedException("Only the request owner can make this payment.");
        }
        if (!mockEnabled) throw new BadRequestException("Live payments are not configured. No payment was processed.");
        if (paymentRepository.existsByRequestIdAndStatus(request.getId(), PaymentStatus.PAID)) {
            throw new BadRequestException("This request has already been paid.");
        }
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", customerId));

        if (request.getProvider() == null) {
            throw new BadRequestException("Cannot make payment for a service request without an assigned provider.");
        }

        BigDecimal amount = invoiceRepository.findByRequestId(request.getId())
                .map(Invoice::getTotalAmount).orElse(request.getFinalPrice());
        if (amount == null || amount.signum() <= 0) throw new BadRequestException("A final service amount is required before payment.");
        if (requestDto.amount() != null && amount.compareTo(requestDto.amount()) != 0) {
            throw new BadRequestException("The payment amount does not match the final invoice.");
        }

        String paymentCode = "PAY-2026-" + String.format("%05d", (int)(Math.random() * 90000 + 10000));
        String txnRef = "TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();

        Payment payment = new Payment();
        payment.setPaymentCode(paymentCode);
        payment.setRequest(request);
        payment.setCustomer(customer);
        payment.setProvider(request.getProvider());
        payment.setAmount(amount);
        payment.setPaymentMethod(requestDto.paymentMethod());
        payment.setStatus(PaymentStatus.PAID);
        payment.setTransactionReference(txnRef);

        Payment savedPayment = paymentRepository.save(payment);

        // Update request status if appropriate
        if (request.getStatus() == RequestStatus.WORKING || request.getStatus() == RequestStatus.ARRIVED) {
            request.setStatus(RequestStatus.COMPLETED);
            requestRepository.save(request);
        }

        // Update Invoice status if present
        invoiceRepository.findByRequestId(request.getId()).ifPresent(invoice -> {
            invoice.setPaymentStatus("PAID");
            invoiceRepository.save(invoice);
        });

        return mapToDto(savedPayment);
    }

    @Override
    public PaymentResponseDto getPaymentByCode(String paymentCode) {
        Payment payment = paymentRepository.findByPaymentCode(paymentCode)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "paymentCode", paymentCode));
        com.lankaease.security.ResourceAccess.requireRequest(payment.getRequest());
        return mapToDto(payment);
    }

    @Override
    public PaymentResponseDto getPaymentByRequestId(Long requestId) {
        Payment payment = paymentRepository.findFirstByRequestIdOrderByCreatedAtDesc(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment for request ID", "id", requestId));
        com.lankaease.security.ResourceAccess.requireRequest(payment.getRequest());
        return mapToDto(payment);
    }

    private PaymentResponseDto mapToDto(Payment p) {
        return new PaymentResponseDto(
                p.getId(),
                p.getPaymentCode(),
                p.getRequest().getId(),
                p.getRequest().getRequestCode(),
                p.getAmount(),
                p.getPaymentMethod(),
                p.getStatus(),
                p.getTransactionReference(),
                p.getCreatedAt()
        );
    }
}
