package com.lankaease.repository;

import com.lankaease.entity.SavedProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedProviderRepository extends JpaRepository<SavedProvider, Long> {
    List<SavedProvider> findByCustomerId(Long customerId);
    Optional<SavedProvider> findByCustomerIdAndProviderId(Long customerId, Long providerId);
    Boolean existsByCustomerIdAndProviderId(Long customerId, Long providerId);
}
