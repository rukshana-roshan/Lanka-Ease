package com.lankaease.repository;

import com.lankaease.entity.ProviderProfile;
import com.lankaease.entity.User;
import com.lankaease.entity.enums.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProviderProfileRepository extends JpaRepository<ProviderProfile, Long> {
    Optional<ProviderProfile> findByUser(User user);
    Optional<ProviderProfile> findByUserId(Long userId);
    List<ProviderProfile> findByVerificationStatus(VerificationStatus status);
    List<ProviderProfile> findByIsVerifiedTrue();

    @Query("SELECT DISTINCT p FROM ProviderProfile p LEFT JOIN p.categories c WHERE " +
           "(:categoryId IS NULL OR c.id = :categoryId) AND " +
           "(:verifiedOnly IS FALSE OR p.isVerified = true) AND " +
           "(:availableOnly IS FALSE OR p.isAvailable = true)")
    List<ProviderProfile> searchProviders(@Param("categoryId") Long categoryId,
                                           @Param("verifiedOnly") Boolean verifiedOnly,
                                           @Param("availableOnly") Boolean availableOnly);
}
