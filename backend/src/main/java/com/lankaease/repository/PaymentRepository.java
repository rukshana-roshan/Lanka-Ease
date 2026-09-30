package com.lankaease.repository;

import com.lankaease.entity.Payment;
import com.lankaease.entity.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByPaymentCode(String paymentCode);
    List<Payment> findByCustomerId(Long customerId);
    List<Payment> findByProviderId(Long providerId);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'PAID'")
    BigDecimal calculateTotalRevenue();
}
