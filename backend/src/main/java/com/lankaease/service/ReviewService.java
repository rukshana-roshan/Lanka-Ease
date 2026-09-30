package com.lankaease.service;

import com.lankaease.dto.request.CreateReviewRequestDto;
import com.lankaease.dto.response.ReviewResponseDto;
import java.util.List;

public interface ReviewService {
    ReviewResponseDto createReview(CreateReviewRequestDto dto, Long customerId);
    List<ReviewResponseDto> getProviderReviews(Long providerId);
}
