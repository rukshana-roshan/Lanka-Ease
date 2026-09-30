package com.lankaease.service;

import com.lankaease.dto.request.CreateServiceRequestDto;
import com.lankaease.dto.request.UpdateStatusRequestDto;
import com.lankaease.dto.response.ServiceRequestResponseDto;
import com.lankaease.entity.enums.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ServiceRequestService {
    ServiceRequestResponseDto createRequest(CreateServiceRequestDto dto, Long customerId);
    ServiceRequestResponseDto getRequestById(Long id);
    ServiceRequestResponseDto getRequestByCode(String requestCode);
    List<ServiceRequestResponseDto> getCustomerRequests(Long customerId);
    List<ServiceRequestResponseDto> getProviderRequests(Long providerUserId);
    ServiceRequestResponseDto updateRequestStatus(Long requestId, UpdateStatusRequestDto dto, Long currentUserId);
    Page<ServiceRequestResponseDto> getAllRequests(RequestStatus status, Long categoryId, Pageable pageable);
}
