package com.lankaease.repository;

import com.lankaease.entity.VerificationRequest;
import com.lankaease.entity.enums.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VerificationRequestRepository extends JpaRepository<VerificationRequest, Long> {
    List<VerificationRequest> findByStatus(VerificationStatus status);
    List<VerificationRequest> findByProviderId(Long providerId);
}
