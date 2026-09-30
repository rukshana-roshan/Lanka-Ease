package com.lankaease.controller;

import com.lankaease.dto.request.SendMessageRequestDto;
import com.lankaease.dto.response.ConversationResponseDto;
import com.lankaease.dto.response.MessageResponseDto;
import com.lankaease.security.UserPrincipal;
import com.lankaease.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conversations")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/start")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ConversationResponseDto> startConversation(
            @RequestParam Long providerUserId,
            @RequestParam(required = false) Long requestId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(chatService.getOrCreateConversation(userPrincipal.getId(), providerUserId, requestId));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ConversationResponseDto>> getUserConversations(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(chatService.getUserConversations(userPrincipal.getId()));
    }

    @GetMapping("/{id}/messages")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MessageResponseDto>> getMessages(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(chatService.getMessages(id, userPrincipal.getId()));
    }

    @PostMapping("/{id}/messages")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponseDto> sendMessage(
            @PathVariable Long id,
            @RequestBody SendMessageRequestDto dto,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(chatService.sendMessage(id, userPrincipal.getId(), dto));
    }

    // STOMP WebSocket Message Endpoint
    @MessageMapping("/chat/{conversationId}")
    @SendTo("/topic/conversation/{conversationId}")
    public MessageResponseDto handleWebSocketMessage(@DestinationVariable Long conversationId, SendMessageRequestDto dto) {
        // Fallback sender ID 2 (Kamal Perera demo) if unauthenticated STOMP payload
        return chatService.sendMessage(conversationId, 2L, dto);
    }
}
