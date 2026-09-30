package com.lankaease.controller;

import com.lankaease.ai.AIService;
import com.lankaease.dto.request.SmartAiRequestDto;
import com.lankaease.dto.response.SmartAiResponseDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AIService aiService;

    public AiController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/classify")
    public ResponseEntity<SmartAiResponseDto> classifyRequest(@Valid @RequestBody SmartAiRequestDto request) {
        return ResponseEntity.ok(aiService.classifyServiceRequest(request.problemDescription()));
    }
}
