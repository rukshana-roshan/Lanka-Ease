package com.lankaease.repository;

import com.lankaease.entity.ServiceRequest;
import com.lankaease.entity.enums.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    Optional<ServiceRequest> findByRequestCode(String requestCode);
    List<ServiceRequest> findByCustomerId(Long customerId);
    Page<ServiceRequest> findByCustomerId(Long customerId, Pageable pageable);
    List<ServiceRequest> findByProviderId(Long providerId);
    Page<ServiceRequest> findByProviderId(Long providerId, Pageable pageable);
    List<ServiceRequest> findByCustomerIdAndFamilyMemberIsNotNull(Long customerId);

    @Query("SELECT r FROM ServiceRequest r WHERE " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:categoryId IS NULL OR r.category.id = :categoryId)")
    Page<ServiceRequest> findWithFilters(@Param("status") RequestStatus status,
                                         @Param("categoryId") Long categoryId,
                                         Pageable pageable);

    Long countByStatus(RequestStatus status);
}
