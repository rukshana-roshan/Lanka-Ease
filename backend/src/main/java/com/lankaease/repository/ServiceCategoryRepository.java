package com.lankaease.repository;

import com.lankaease.entity.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceCategoryRepository extends JpaRepository<ServiceCategory, Long> {
    Optional<ServiceCategory> findBySlug(String slug);
    Optional<ServiceCategory> findByNameIgnoreCase(String name);
    List<ServiceCategory> findByIsActiveTrue();
}
