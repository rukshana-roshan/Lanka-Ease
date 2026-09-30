package com.lankaease.repository;

import com.lankaease.entity.ServiceArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceAreaRepository extends JpaRepository<ServiceArea, Long> {
    List<ServiceArea> findByProviderId(Long providerId);
}
