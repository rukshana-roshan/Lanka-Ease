package com.lankaease.controller;

import com.lankaease.dto.response.ProviderResponseDto;
import com.lankaease.security.UserPrincipal;
import com.lankaease.service.ProviderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/providers")
public class ProviderController {

    private final ProviderService providerService;

    public ProviderController(ProviderService providerService) {
        this.providerService = providerService;
    }

    @GetMapping
    public ResponseEntity<List<ProviderResponseDto>> searchProviders(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false, defaultValue = "false") Boolean verifiedOnly,
            @RequestParam(required = false, defaultValue = "false") Boolean availableOnly) {
        return ResponseEntity.ok(providerService.searchProviders(categoryId, verifiedOnly, availableOnly));
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<ProviderResponseDto>> getNearbyProviders(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon,
            @RequestParam(required = false, defaultValue = "15.0") Double radiusKm) {
        return ResponseEntity.ok(providerService.getNearbyProviders(lat, lon, radiusKm));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProviderResponseDto> getProviderById(@PathVariable Long id) {
        return ResponseEntity.ok(providerService.getProviderById(id));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ProviderResponseDto> getMyProviderProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(providerService.getProviderByUserId(userPrincipal.getId()));
    }

    @PatchMapping("/me/availability")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ProviderResponseDto> updateAvailability(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam Boolean isAvailable) {
        return ResponseEntity.ok(providerService.updateProviderAvailability(userPrincipal.getId(), isAvailable));
    }
}
