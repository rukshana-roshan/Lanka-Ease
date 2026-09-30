package com.lankaease.controller;

import com.lankaease.dto.request.CreateServiceRequestDto;
import com.lankaease.dto.request.UpdateStatusRequestDto;
import com.lankaease.dto.response.ServiceRequestResponseDto;
import com.lankaease.entity.enums.RequestStatus;
import com.lankaease.security.UserPrincipal;
import com.lankaease.service.ServiceRequestService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class ServiceRequestController {

    private final ServiceRequestService requestService;

    public ServiceRequestController(ServiceRequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ServiceRequestResponseDto> createRequest(
            @Valid @RequestBody CreateServiceRequestDto dto,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(requestService.createRequest(dto, userPrincipal.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceRequestResponseDto> getRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.getRequestById(id));
    }

    @GetMapping("/code/{requestCode}")
    public ResponseEntity<ServiceRequestResponseDto> getRequestByCode(@PathVariable String requestCode) {
        return ResponseEntity.ok(requestService.getRequestByCode(requestCode));
    }

    @GetMapping("/customer")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<List<ServiceRequestResponseDto>> getCustomerRequests(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(requestService.getCustomerRequests(userPrincipal.getId()));
    }

    @GetMapping("/provider")
    @PreAuthorize("hasAnyRole('PROVIDER', 'ADMIN')")
    public ResponseEntity<List<ServiceRequestResponseDto>> getProviderRequests(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(requestService.getProviderRequests(userPrincipal.getId()));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ServiceRequestResponseDto> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateStatusRequestDto dto,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(requestService.updateRequestStatus(id, dto, userPrincipal.getId()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<ServiceRequestResponseDto>> getAllRequests(
            @RequestParam(required = false) RequestStatus status,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(requestService.getAllRequests(status, categoryId, PageRequest.of(page, size)));
    }
}
