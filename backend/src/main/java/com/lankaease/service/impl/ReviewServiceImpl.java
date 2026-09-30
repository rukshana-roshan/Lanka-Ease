package com.lankaease.service.impl;

import com.lankaease.dto.request.CreateReviewRequestDto;
import com.lankaease.dto.response.ReviewResponseDto;
import com.lankaease.entity.*;
import com.lankaease.entity.enums.RequestStatus;
import com.lankaease.exception.BadRequestException;
import com.lankaease.exception.ResourceNotFoundException;
import com.lankaease.repository.*;
import com.lankaease.service.ReviewService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ServiceRequestRepository requestRepository;
    private final ProviderProfileRepository providerRepository;
    private final UserRepository userRepository;

    public ReviewServiceImpl(ReviewRepository reviewRepository,
                             ServiceRequestRepository requestRepository,
                             ProviderProfileRepository providerRepository,
                             UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.requestRepository = requestRepository;
        this.providerRepository = providerRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public ReviewResponseDto createReview(CreateReviewRequestDto dto, Long customerId) {
        ServiceRequest request = requestRepository.findById(dto.requestId())
                .orElseThrow(() -> new ResourceNotFoundException("ServiceRequest", "id", dto.requestId()));

        if (!request.getCustomer().getId().equals(customerId)) {
            throw new BadRequestException("Only the request owner can submit a review.");
        }

        if (request.getStatus() != RequestStatus.COMPLETED && request.getStatus() != RequestStatus.REVIEWED) {
            throw new BadRequestException("Can only review completed requests.");
        }

        if (reviewRepository.findByRequestId(dto.requestId()).isPresent()) {
            throw new BadRequestException("Review has already been submitted for this request.");
        }

        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", customerId));

        ProviderProfile provider = request.getProvider();
        if (provider == null) {
            throw new BadRequestException("Request has no provider assigned to review.");
        }

        Review review = new Review(
                request,
                customer,
                provider,
                dto.rating(),
                dto.reviewText(),
                dto.photoUrl()
        );

        Review saved = reviewRepository.save(review);

        // Update request status
        request.setStatus(RequestStatus.REVIEWED);
        requestRepository.save(request);

        // Recalculate provider average rating & completed count
        Double avg = reviewRepository.getAverageRatingForProvider(provider.getId());
        if (avg != null) {
            provider.setRatingAvg(BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP));
            provider.setJobsCompletedCount(provider.getJobsCompletedCount() + 1);
            providerRepository.save(provider);
        }

        return mapToDto(saved);
    }

    @Override
    public List<ReviewResponseDto> getProviderReviews(Long providerId) {
        return reviewRepository.findByProviderIdOrderByCreatedAtDesc(providerId).stream()
                .map(this::mapToDto)
                .toList();
    }

    private ReviewResponseDto mapToDto(Review r) {
        return new ReviewResponseDto(
                r.getId(),
                r.getRequest().getId(),
                r.getRequest().getRequestCode(),
                r.getCustomer().getFullName(),
                r.getCustomer().getProfileImage(),
                r.getProvider().getId(),
                r.getProvider().getBusinessName(),
                r.getRating(),
                r.getReviewText(),
                r.getPhotoUrl(),
                r.getCreatedAt()
        );
    }
}
