package com.lankaease.service.impl;

import com.lankaease.dto.request.SendMessageRequestDto;
import com.lankaease.dto.response.ConversationResponseDto;
import com.lankaease.dto.response.MessageResponseDto;
import com.lankaease.entity.*;
import com.lankaease.exception.BadRequestException;
import com.lankaease.exception.ResourceNotFoundException;
import com.lankaease.repository.*;
import com.lankaease.service.ChatService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class ChatServiceImpl implements ChatService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ServiceRequestRepository requestRepository;

    public ChatServiceImpl(ConversationRepository conversationRepository,
                           MessageRepository messageRepository,
                           UserRepository userRepository,
                           ServiceRequestRepository requestRepository) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.requestRepository = requestRepository;
    }

    @Override
    @Transactional
    public ConversationResponseDto getOrCreateConversation(Long customerId, Long providerUserId, Long requestId) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", customerId));
        User provider = userRepository.findById(providerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", providerUserId));

        ServiceRequest request = null;
        if (requestId != null) {
            request = requestRepository.findById(requestId).orElse(null);
        }

        Conversation conversation = conversationRepository.findByCustomerIdAndProviderId(customerId, providerUserId)
                .orElseGet(() -> {
                    Conversation c = new Conversation(customer, provider, null);
                    return conversationRepository.save(c);
                });

        if (request != null && conversation.getRequest() == null) {
            conversation.setRequest(request);
            conversation = conversationRepository.save(conversation);
        }

        return mapToConversationDto(conversation, customerId);
    }

    @Override
    public List<ConversationResponseDto> getUserConversations(Long userId) {
        List<Conversation> list = conversationRepository.findByCustomerIdOrProviderId(userId, userId);
        return list.stream().map(c -> mapToConversationDto(c, userId)).toList();
    }

    @Override
    @Transactional
    public List<MessageResponseDto> getMessages(Long conversationId, Long userId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation", "id", conversationId));

        if (!Objects.equals(conversation.getCustomer().getId(), userId) && !Objects.equals(conversation.getProvider().getId(), userId)) {
            throw new BadRequestException("Unauthorized to access conversation messages.");
        }

        List<Message> messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);

        // Mark unread messages as read
        messages.stream()
                .filter(m -> !Objects.equals(m.getSender().getId(), userId) && !m.getIsRead())
                .forEach(m -> {
                    m.setIsRead(true);
                    messageRepository.save(m);
                });

        return messages.stream().map(this::mapToMessageDto).toList();
    }

    @Override
    @Transactional
    public MessageResponseDto sendMessage(Long conversationId, Long senderId, SendMessageRequestDto requestDto) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation", "id", conversationId));

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", senderId));

        Message message = new Message(conversation, sender, requestDto.textContent(), requestDto.mediaUrl());
        Message saved = messageRepository.save(message);

        conversation.setUpdatedAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        return mapToMessageDto(saved);
    }

    private ConversationResponseDto mapToConversationDto(Conversation c, Long currentUserId) {
        User otherUser = Objects.equals(c.getCustomer().getId(), currentUserId) ? c.getProvider() : c.getCustomer();
        List<Message> msgs = messageRepository.findByConversationIdOrderByCreatedAtAsc(c.getId());
        String lastMsg = msgs.isEmpty() ? "Conversation started" : msgs.getLast().getTextContent();
        LocalDateTime lastTime = msgs.isEmpty() ? c.getCreatedAt() : msgs.getLast().getCreatedAt();
        Long unreadCount = messageRepository.countByConversationIdAndSenderIdNotAndIsReadFalse(c.getId(), currentUserId);

        return new ConversationResponseDto(
                c.getId(),
                otherUser.getId(),
                otherUser.getFullName(),
                otherUser.getProfileImage(),
                c.getRequest() != null ? c.getRequest().getId() : null,
                c.getRequest() != null ? c.getRequest().getRequestCode() : null,
                lastMsg,
                lastTime,
                unreadCount
        );
    }

    private MessageResponseDto mapToMessageDto(Message m) {
        return new MessageResponseDto(
                m.getId(),
                m.getConversation().getId(),
                m.getSender().getId(),
                m.getSender().getFullName(),
                m.getSender().getProfileImage(),
                m.getTextContent(),
                m.getMediaUrl(),
                m.getIsRead(),
                m.getCreatedAt()
        );
    }
}
