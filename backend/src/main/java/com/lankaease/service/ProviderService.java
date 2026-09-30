package com.lankaease.service;

import com.lankaease.dto.response.ProviderResponseDto;
import java.util.List;

public interface ProviderService {
    List<ProviderResponseDto> searchProviders(Long categoryId, Boolean verifiedOnly, Boolean availableOnly);
    List<ProviderResponseDto> getNearbyProviders(Double lat, Double lon, Double radiusKm);
    ProviderResponseDto getProviderById(Long id);
    ProviderResponseDto getProviderByUserId(Long userId);
    ProviderResponseDto updateProviderAvailability(Long userId, Boolean isAvailable);
}
