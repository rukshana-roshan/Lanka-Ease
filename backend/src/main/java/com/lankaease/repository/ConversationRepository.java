package com.lankaease.repository;

import com.lankaease.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    List<Conversation> findByCustomerIdOrProviderId(Long customerId, Long providerId);
    Optional<Conversation> findByCustomerIdAndProviderIdAndRequestId(Long customerId, Long providerId, Long requestId);
    Optional<Conversation> findByCustomerIdAndProviderId(Long customerId, Long providerId);
}
