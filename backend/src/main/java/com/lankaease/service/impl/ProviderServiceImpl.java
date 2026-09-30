package com.lankaease.service.impl;

import com.lankaease.dto.response.ProviderResponseDto;
import com.lankaease.dto.response.ServiceCategoryResponseDto;
import com.lankaease.entity.ProviderProfile;
import com.lankaease.entity.ServiceArea;
import com.lankaease.exception.ResourceNotFoundException;
import com.lankaease.map.MapService;
import com.lankaease.repository.ProviderProfileRepository;
import com.lankaease.service.ProviderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProviderServiceImpl implements ProviderService {

    private final ProviderProfileRepository providerRepository;
    private final MapService mapService;

    public ProviderServiceImpl(ProviderProfileRepository providerRepository, MapService mapService) {
        this.providerRepository = providerRepository;
        this.mapService = mapService;
    }

    @Override
    public List<ProviderResponseDto> searchProviders(Long categoryId, Boolean verifiedOnly, Boolean availableOnly) {
        Boolean verified = verifiedOnly != null && verifiedOnly;
        Boolean available = availableOnly != null && availableOnly;
        List<ProviderProfile> providers = providerRepository.searchProviders(categoryId, verified, available);
        return providers.stream().map(this::mapToDto).toList();
    }

    @Override
    public List<ProviderResponseDto> getNearbyProviders(Double lat, Double lon, Double radiusKm) {
        double maxRadius = radiusKm != null ? radiusKm : 15.0;
        double userLat = lat != null ? lat : 6.9147; // Default Colombo 03
        double userLon = lon != null ? lon : 79.8510;

        List<ProviderProfile> all = providerRepository.findAll();
        return all.stream()
                .filter(p -> {
                    if (p.getCurrentLatitude() == null || p.getCurrentLongitude() == null) return true;
                    double dist = mapService.calculateDistanceKm(userLat, userLon, p.getCurrentLatitude(), p.getCurrentLongitude());
                    return dist <= maxRadius;
                })
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public ProviderResponseDto getProviderById(Long id) {
        ProviderProfile provider = providerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProviderProfile", "id", id));
        return mapToDto(provider);
    }

    @Override
    public ProviderResponseDto getProviderByUserId(Long userId) {
        ProviderProfile provider = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("ProviderProfile", "userId", userId));
        return mapToDto(provider);
    }

    @Override
    @Transactional
    public ProviderResponseDto updateProviderAvailability(Long userId, Boolean isAvailable) {
        ProviderProfile provider = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("ProviderProfile", "userId", userId));
        provider.setIsAvailable(isAvailable);
        ProviderProfile saved = providerRepository.save(provider);
        return mapToDto(saved);
    }

    private ProviderResponseDto mapToDto(ProviderProfile p) {
        List<ServiceCategoryResponseDto> categoryDtos = p.getCategories().stream()
                .map(c -> new ServiceCategoryResponseDto(c.getId(), c.getName(), c.getSlug(), c.getDescription(), c.getIconName(), c.getIsActive()))
                .toList();

        List<String> cities = p.getServiceAreas().stream()
                .map(ServiceArea::getCityName)
                .toList();

        return new ProviderResponseDto(
                p.getId(),
                p.getUser().getId(),
                p.getUser().getFullName(),
                p.getBusinessName(),
                p.getDescription(),
                p.getExperienceYears(),
                p.getPriceMin(),
                p.getPriceMax(),
                p.getIsVerified(),
                p.getVerificationStatus(),
                p.getRatingAvg(),
                p.getJobsCompletedCount(),
                p.getResponseTimeMinutes(),
                p.getIsAvailable(),
                p.getCurrentLatitude() != null ? p.getCurrentLatitude() : 6.9147,
                p.getCurrentLongitude() != null ? p.getCurrentLongitude() : 79.8510,
                p.getUser().getProfileImage(),
                p.getUser().getPhone(),
                p.getUser().getEmail(),
                categoryDtos,
                cities
        );
    }
}
