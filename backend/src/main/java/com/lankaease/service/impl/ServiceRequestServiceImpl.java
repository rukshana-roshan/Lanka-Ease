package com.lankaease.service.impl;

import com.lankaease.dto.request.CreateServiceRequestDto;
import com.lankaease.dto.request.UpdateStatusRequestDto;
import com.lankaease.dto.response.ServiceRequestResponseDto;
import com.lankaease.entity.*;
import com.lankaease.entity.enums.RequestStatus;
import com.lankaease.entity.enums.Urgency;
import com.lankaease.exception.BadRequestException;
import com.lankaease.exception.ResourceNotFoundException;
import com.lankaease.repository.*;
import com.lankaease.service.ServiceRequestService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class ServiceRequestServiceImpl implements ServiceRequestService {

    private final ServiceRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final FamilyMemberRepository familyMemberRepository;
    private final ServiceCategoryRepository categoryRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final RequestMediaRepository mediaRepository;
    private final RequestStatusHistoryRepository statusHistoryRepository;
    private final NotificationRepository notificationRepository;
    private final InvoiceRepository invoiceRepository;

    public ServiceRequestServiceImpl(ServiceRequestRepository requestRepository,
                                     UserRepository userRepository,
                                     FamilyMemberRepository familyMemberRepository,
                                     ServiceCategoryRepository categoryRepository,
                                     ProviderProfileRepository providerProfileRepository,
                                     RequestMediaRepository mediaRepository,
                                     RequestStatusHistoryRepository statusHistoryRepository,
                                     NotificationRepository notificationRepository,
                                     InvoiceRepository invoiceRepository) {
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
        this.familyMemberRepository = familyMemberRepository;
        this.categoryRepository = categoryRepository;
        this.providerProfileRepository = providerProfileRepository;
        this.mediaRepository = mediaRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.notificationRepository = notificationRepository;
        this.invoiceRepository = invoiceRepository;
    }

    @Override
    @Transactional
    public ServiceRequestResponseDto createRequest(CreateServiceRequestDto dto, Long customerId) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", customerId));

        ServiceCategory category = categoryRepository.findById(dto.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("ServiceCategory", "id", dto.categoryId()));

        FamilyMember familyMember = null;
        if (dto.familyMemberId() != null) {
            familyMember = familyMemberRepository.findById(dto.familyMemberId())
                    .orElseThrow(() -> new ResourceNotFoundException("FamilyMember", "id", dto.familyMemberId()));
        }

        ProviderProfile provider = null;
        if (dto.providerId() != null) {
            provider = providerProfileRepository.findById(dto.providerId()).orElse(null);
        }

        String requestCode = "REQ-2026-" + String.format("%04d", (int)(Math.random() * 9000 + 1000));

        ServiceRequest request = new ServiceRequest();
        request.setRequestCode(requestCode);
        request.setCustomer(customer);
        request.setFamilyMember(familyMember);
        request.setCategory(category);
        request.setProvider(provider);
        request.setProblemDescription(dto.problemDescription());
        request.setAiSuggestion(dto.aiSuggestion());
        request.setAddress(dto.address());
        request.setLatitude(dto.latitude() != null ? dto.latitude() : 6.9147);
        request.setLongitude(dto.longitude() != null ? dto.longitude() : 79.8510);
        request.setPreferredDate(dto.preferredDate());
        request.setPreferredTime(dto.preferredTime());
        request.setUrgency(dto.urgency() != null ? dto.urgency() : Urgency.NORMAL);
        request.setStatus(dto.isDraft() != null && dto.isDraft() ? RequestStatus.DRAFT : (provider != null ? RequestStatus.ACCEPTED : RequestStatus.CREATED));
        request.setEstimatedPrice(provider != null ? provider.getPriceMin() : new BigDecimal("2500.00"));

        ServiceRequest saved = requestRepository.save(request);

        if (dto.mediaUrls() != null) {
            for (String url : dto.mediaUrls()) {
                RequestMedia media = new RequestMedia(saved, url, "image", "upload.jpg");
                mediaRepository.save(media);
            }
        }

        // Save status history
        RequestStatusHistory history = new RequestStatusHistory(saved, null, saved.getStatus(), "Request created", customer);
        statusHistoryRepository.save(history);

        // Notify customer
        Notification notification = new Notification(customer, "Service Request Created 📝", "Request " + requestCode + " has been created successfully.", "REQUEST_CREATED", requestCode);
        notificationRepository.save(notification);

        return mapToDto(saved);
    }

    @Override
    public ServiceRequestResponseDto getRequestById(Long id) {
        ServiceRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ServiceRequest", "id", id));
        return mapToDto(request);
    }

    @Override
    public ServiceRequestResponseDto getRequestByCode(String requestCode) {
        ServiceRequest request = requestRepository.findByRequestCode(requestCode)
                .orElseThrow(() -> new ResourceNotFoundException("ServiceRequest", "requestCode", requestCode));
        return mapToDto(request);
    }

    @Override
    public List<ServiceRequestResponseDto> getCustomerRequests(Long customerId) {
        return requestRepository.findByCustomerId(customerId).stream().map(this::mapToDto).toList();
    }

    @Override
    public List<ServiceRequestResponseDto> getProviderRequests(Long providerUserId) {
        ProviderProfile provider = providerProfileRepository.findByUserId(providerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("ProviderProfile", "userId", providerUserId));
        return requestRepository.findByProviderId(provider.getId()).stream().map(this::mapToDto).toList();
    }

    @Override
    @Transactional
    public ServiceRequestResponseDto updateRequestStatus(Long requestId, UpdateStatusRequestDto dto, Long currentUserId) {
        ServiceRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("ServiceRequest", "id", requestId));

        User currentUser = userRepository.findById(currentUserId).orElse(null);
        RequestStatus oldStatus = request.getStatus();
        request.setStatus(dto.newStatus());

        if (dto.finalPrice() != null) {
            request.setFinalPrice(dto.finalPrice());
        }
        if (dto.cancelReason() != null) {
            request.setCancelReason(dto.cancelReason());
        }

        // Auto assign provider if provider accepting
        if (oldStatus == RequestStatus.CREATED && dto.newStatus() == RequestStatus.ACCEPTED && request.getProvider() == null && currentUser != null) {
            providerProfileRepository.findByUserId(currentUser.getId()).ifPresent(request::setProvider);
        }

        ServiceRequest saved = requestRepository.save(request);

        // Record History
        RequestStatusHistory history = new RequestStatusHistory(saved, oldStatus, dto.newStatus(), dto.notes(), currentUser);
        statusHistoryRepository.save(history);

        // Create Invoice on COMPLETION
        if (dto.newStatus() == RequestStatus.COMPLETED && request.getProvider() != null) {
            createInvoiceForRequest(request, dto.labourFee(), dto.partsFee());
        }

        // Send Notification
        String msg = "Request " + request.getRequestCode() + " status updated to " + dto.newStatus().name();
        Notification n = new Notification(request.getCustomer(), "Request Status Updated 🔔", msg, "REQUEST_STATUS", request.getRequestCode());
        notificationRepository.save(n);

        return mapToDto(saved);
    }

    @Override
    public Page<ServiceRequestResponseDto> getAllRequests(RequestStatus status, Long categoryId, Pageable pageable) {
        return requestRepository.findWithFilters(status, categoryId, pageable).map(this::mapToDto);
    }

    private void createInvoiceForRequest(ServiceRequest request, BigDecimal labour, BigDecimal parts) {
        if (invoiceRepository.findByRequestId(request.getId()).isPresent()) return;

        BigDecimal labourFee = labour != null ? labour : new BigDecimal("2000.00");
        BigDecimal partsFee = parts != null ? parts : new BigDecimal("500.00");
        BigDecimal serviceFee = new BigDecimal("200.00");
        BigDecimal total = labourFee.add(partsFee).add(serviceFee);

        String invoiceNum = "INV-2026-" + String.format("%04d", (int)(Math.random() * 9000 + 1000));

        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber(invoiceNum);
        invoice.setRequest(request);
        invoice.setCustomer(request.getCustomer());
        invoice.setProvider(request.getProvider());
        invoice.setLabourFee(labourFee);
        invoice.setPartsFee(partsFee);
        invoice.setServiceFee(serviceFee);
        invoice.setTotalAmount(total);
        invoice.setPaymentStatus("PENDING");

        List<InvoiceItem> items = new ArrayList<>();
        items.add(new InvoiceItem(invoice, request.getCategory().getName() + " Service Labour Charge", 1, labourFee, labourFee));
        if (partsFee.compareTo(BigDecimal.ZERO) > 0) {
            items.add(new InvoiceItem(invoice, "Replacement Parts / Materials", 1, partsFee, partsFee));
        }
        items.add(new InvoiceItem(invoice, "LankaEase Platform Booking Fee", 1, serviceFee, serviceFee));

        invoice.setItems(items);
        invoiceRepository.save(invoice);
    }

    private ServiceRequestResponseDto mapToDto(ServiceRequest r) {
        List<String> urls = r.getMediaList() != null ? r.getMediaList().stream().map(RequestMedia::getFileUrl).toList() : List.of();

        return new ServiceRequestResponseDto(
                r.getId(),
                r.getRequestCode(),
                r.getCustomer().getId(),
                r.getCustomer().getFullName(),
                r.getCustomer().getPhone(),
                r.getCustomer().getProfileImage(),
                r.getFamilyMember() != null ? r.getFamilyMember().getId() : null,
                r.getFamilyMember() != null ? r.getFamilyMember().getName() : null,
                r.getFamilyMember() != null ? r.getFamilyMember().getRelationship().name() : null,
                r.getCategory().getId(),
                r.getCategory().getName(),
                r.getCategory().getSlug(),
                r.getProvider() != null ? r.getProvider().getId() : null,
                r.getProvider() != null ? r.getProvider().getUser().getFullName() : null,
                r.getProvider() != null ? r.getProvider().getBusinessName() : null,
                r.getProvider() != null ? r.getProvider().getUser().getPhone() : null,
                r.getProblemDescription(),
                r.getAiSuggestion(),
                r.getAddress(),
                r.getLatitude(),
                r.getLongitude(),
                r.getPreferredDate(),
                r.getPreferredTime(),
                r.getUrgency(),
                r.getStatus(),
                r.getEstimatedPrice(),
                r.getFinalPrice(),
                r.getCancelReason(),
                urls,
                r.getCreatedAt(),
                r.getUpdatedAt()
        );
    }
}
