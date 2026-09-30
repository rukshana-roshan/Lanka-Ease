package com.lankaease.service;

import com.lankaease.dto.request.SendMessageRequestDto;
import com.lankaease.dto.response.ConversationResponseDto;
import com.lankaease.dto.response.MessageResponseDto;
import java.util.List;

public interface ChatService {
    ConversationResponseDto getOrCreateConversation(Long customerId, Long providerUserId, Long requestId);
    List<ConversationResponseDto> getUserConversations(Long userId);
    List<MessageResponseDto> getMessages(Long conversationId, Long userId);
    MessageResponseDto sendMessage(Long conversationId, Long senderId, SendMessageRequestDto requestDto);
}
