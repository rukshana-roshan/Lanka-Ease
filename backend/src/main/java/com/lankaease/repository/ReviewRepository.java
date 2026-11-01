package com.lankaease.repository;

import com.lankaease.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findByRequestId(Long requestId);
    @Query("SELECT r FROM Review r WHERE r.provider.id=:providerId AND r.hidden=false ORDER BY r.createdAt DESC")
    List<Review> findByProviderIdOrderByCreatedAtDesc(@Param("providerId") Long providerId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.provider.id = :providerId AND r.hidden=false")
    Double getAverageRatingForProvider(@Param("providerId") Long providerId);
}
