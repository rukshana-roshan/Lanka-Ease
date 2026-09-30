package com.lankaease.dto.response;

import java.math.BigDecimal;

public record AdminDashboardStats(
    Long totalUsers,
    Long totalCustomers,
    Long totalProviders,
    Long pendingVerifications,
    Long activeRequests,
    Long completedRequests,
    BigDecimal totalRevenue
) {}
