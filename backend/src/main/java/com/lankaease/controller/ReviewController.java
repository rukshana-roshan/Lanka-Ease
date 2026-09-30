package com.lankaease.controller;

import com.lankaease.dto.request.CreateReviewRequestDto;
import com.lankaease.dto.response.ReviewResponseDto;
import com.lankaease.security.UserPrincipal;
import com.lankaease.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<ReviewResponseDto> createReview(
            @Valid @RequestBody CreateReviewRequestDto dto,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(reviewService.createReview(dto, userPrincipal.getId()));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<ReviewResponseDto>> getProviderReviews(@PathVariable Long providerId) {
        return ResponseEntity.ok(reviewService.getProviderReviews(providerId));
    }
}
