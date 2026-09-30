package com.lankaease.service;

import com.lankaease.dto.request.LoginRequest;
import com.lankaease.dto.request.RegisterCustomerRequest;
import com.lankaease.dto.request.RegisterProviderRequest;
import com.lankaease.dto.response.JwtAuthResponse;

public interface AuthService {
    JwtAuthResponse login(LoginRequest request);
    JwtAuthResponse registerCustomer(RegisterCustomerRequest request);
    JwtAuthResponse registerProvider(RegisterProviderRequest request);
    JwtAuthResponse refreshToken(String refreshToken);
}
