package com.lankaease.repository;

import com.lankaease.entity.RequestMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestMediaRepository extends JpaRepository<RequestMedia, Long> {
    List<RequestMedia> findByRequestId(Long requestId);
}
