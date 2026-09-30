package com.lankaease.repository;

import com.lankaease.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
    Optional<Invoice> findByRequestId(Long requestId);
    List<Invoice> findByCustomerId(Long customerId);
    List<Invoice> findByProviderId(Long providerId);
}
