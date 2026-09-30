package com.lankaease.service.impl;

import com.lankaease.dto.request.LoginRequest;
import com.lankaease.dto.request.RegisterCustomerRequest;
import com.lankaease.dto.request.RegisterProviderRequest;
import com.lankaease.dto.response.JwtAuthResponse;
import com.lankaease.dto.response.UserResponseDto;
import com.lankaease.entity.*;
import com.lankaease.entity.enums.Role;
import com.lankaease.entity.enums.VerificationStatus;
import com.lankaease.exception.BadRequestException;
import com.lankaease.exception.UnauthorizedException;
import com.lankaease.repository.*;
import com.lankaease.security.JwtTokenProvider;
import com.lankaease.security.UserPrincipal;
import com.lankaease.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final ServiceCategoryRepository categoryRepository;
    private final ServiceAreaRepository serviceAreaRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthServiceImpl(UserRepository userRepository,
                           CustomerProfileRepository customerProfileRepository,
                           ProviderProfileRepository providerProfileRepository,
                           ServiceCategoryRepository categoryRepository,
                           ServiceAreaRepository serviceAreaRepository,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager,
                           JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.customerProfileRepository = customerProfileRepository;
        this.providerProfileRepository = providerProfileRepository;
        this.categoryRepository = categoryRepository;
        this.serviceAreaRepository = serviceAreaRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Override
    public JwtAuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password())
            );

            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            String accessToken = tokenProvider.generateToken(authentication);
            String refreshToken = tokenProvider.generateRefreshToken(userPrincipal);

            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new UnauthorizedException("User account not found"));

            return new JwtAuthResponse(accessToken, refreshToken, mapUserToDto(user));
        } catch (Exception e) {
            throw new UnauthorizedException("Invalid email or password");
        }
    }

    @Override
    @Transactional
    public JwtAuthResponse registerCustomer(RegisterCustomerRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email is already registered: " + request.email());
        }
        if (userRepository.existsByPhone(request.phone())) {
            throw new BadRequestException("Phone number is already registered: " + request.phone());
        }

        User user = new User(
                request.fullName(),
                request.email(),
                request.phone(),
                passwordEncoder.encode(request.password()),
                Role.CUSTOMER
        );
        if (request.preferredLanguage() != null) {
            user.setPreferredLanguage(request.preferredLanguage());
        }

        User savedUser = userRepository.save(user);

        CustomerProfile profile = new CustomerProfile(
                savedUser,
                request.defaultAddress() != null ? request.defaultAddress() : "Colombo 03",
                request.latitude() != null ? request.latitude() : 6.9147,
                request.longitude() != null ? request.longitude() : 79.8510
        );
        customerProfileRepository.save(profile);

        UserPrincipal principal = UserPrincipal.create(savedUser);
        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        String accessToken = tokenProvider.generateToken(auth);
        String refreshToken = tokenProvider.generateRefreshToken(principal);

        return new JwtAuthResponse(accessToken, refreshToken, mapUserToDto(savedUser));
    }

    @Override
    @Transactional
    public JwtAuthResponse registerProvider(RegisterProviderRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email is already registered: " + request.email());
        }
        if (userRepository.existsByPhone(request.phone())) {
            throw new BadRequestException("Phone number is already registered: " + request.phone());
        }

        User user = new User(
                request.fullName(),
                request.email(),
                request.phone(),
                passwordEncoder.encode(request.password()),
                Role.PROVIDER
        );

        User savedUser = userRepository.save(user);

        ProviderProfile profile = new ProviderProfile();
        profile.setUser(savedUser);
        profile.setBusinessName(request.businessName() != null ? request.businessName() : request.fullName() + " Services");
        profile.setDescription(request.description() != null ? request.description() : "Professional service provider on LankaEase.");
        profile.setExperienceYears(request.experienceYears() != null ? request.experienceYears() : 2);
        profile.setIsVerified(false);
        profile.setVerificationStatus(VerificationStatus.PENDING);

        if (request.categoryIds() != null && !request.categoryIds().isEmpty()) {
            Set<ServiceCategory> categories = new HashSet<>(categoryRepository.findAllById(request.categoryIds()));
            profile.setCategories(categories);
        }

        ProviderProfile savedProfile = providerProfileRepository.save(profile);

        if (request.serviceCities() != null) {
            for (String city : request.serviceCities()) {
                ServiceArea area = new ServiceArea(savedProfile, city, "Colombo");
                serviceAreaRepository.save(area);
            }
        }

        UserPrincipal principal = UserPrincipal.create(savedUser);
        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        String accessToken = tokenProvider.generateToken(auth);
        String refreshToken = tokenProvider.generateRefreshToken(principal);

        return new JwtAuthResponse(accessToken, refreshToken, mapUserToDto(savedUser));
    }

    @Override
    public JwtAuthResponse refreshToken(String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new UnauthorizedException("Invalid or expired refresh token");
        }
        Long userId = tokenProvider.getUserIdFromJWT(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        UserPrincipal principal = UserPrincipal.create(user);
        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        String newAccessToken = tokenProvider.generateToken(auth);

        return new JwtAuthResponse(newAccessToken, refreshToken, mapUserToDto(user));
    }

    private UserResponseDto mapUserToDto(User user) {
        return new UserResponseDto(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getPreferredLanguage(),
                user.getProfileImage(),
                user.getIsEmailVerified(),
                user.getCreatedAt()
        );
    }
}
