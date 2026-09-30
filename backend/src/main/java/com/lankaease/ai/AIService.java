package com.lankaease.ai;

import com.lankaease.dto.response.SmartAiResponseDto;

public interface AIService {
    SmartAiResponseDto classifyServiceRequest(String description);
}
