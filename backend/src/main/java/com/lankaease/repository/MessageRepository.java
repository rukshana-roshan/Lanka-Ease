package com.lankaease.repository;

import com.lankaease.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByConversationIdOrderByCreatedAtAsc(Long conversationId);
    Long countByConversationIdAndSenderIdNotAndIsReadFalse(Long conversationId, Long senderId);
}
