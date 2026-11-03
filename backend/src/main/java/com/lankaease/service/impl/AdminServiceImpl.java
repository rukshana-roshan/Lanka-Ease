package com.lankaease.service.impl;

import com.lankaease.dto.request.RegisterCustomerRequest;
import com.lankaease.dto.response.AdminDashboardStats;
import com.lankaease.dto.response.ProviderResponseDto;
import com.lankaease.dto.response.ServiceCategoryResponseDto;
import com.lankaease.dto.response.UserResponseDto;
import com.lankaease.entity.ProviderProfile;
import com.lankaease.entity.ServiceArea;
import com.lankaease.entity.ServiceCategory;
import com.lankaease.entity.User;
import com.lankaease.entity.enums.RequestStatus;
import com.lankaease.entity.enums.Role;
import com.lankaease.entity.enums.VerificationStatus;
import com.lankaease.exception.BadRequestException;
import com.lankaease.exception.ResourceNotFoundException;
import com.lankaease.repository.PaymentRepository;
import com.lankaease.repository.ProviderProfileRepository;
import com.lankaease.repository.ServiceCategoryRepository;
import com.lankaease.repository.ServiceRequestRepository;
import com.lankaease.repository.UserRepository;
import com.lankaease.service.AdminService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {
    @org.springframework.beans.factory.annotation.Autowired private com.lankaease.repository.CustomerProfileRepository customerProfiles;
    @org.springframework.beans.factory.annotation.Autowired private com.lankaease.service.ProviderService providerService;

    private final UserRepository userRepository;
    private final ProviderProfileRepository providerRepository;
    private final ServiceRequestRepository requestRepository;
    private final PaymentRepository paymentRepository;
    private final ServiceCategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminServiceImpl(UserRepository userRepository,
                            ProviderProfileRepository providerRepository,
                            ServiceRequestRepository requestRepository,
                            PaymentRepository paymentRepository,
                            ServiceCategoryRepository categoryRepository,
                            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.providerRepository = providerRepository;
        this.requestRepository = requestRepository;
        this.paymentRepository = paymentRepository;
        this.categoryRepository = categoryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AdminDashboardStats getDashboardStats() {
        Long totalUsers = userRepository.count();
        Long totalCustomers = (long) userRepository.findByRole(Role.CUSTOMER).size();
        Long totalProviders = (long) userRepository.findByRole(Role.PROVIDER).size();
        Long pendingVerifications = (long) providerRepository.findByVerificationStatus(VerificationStatus.PENDING).size();

        Long activeRequests = java.util.stream.Stream.of(RequestStatus.CREATED,RequestStatus.PROVIDER_FOUND,RequestStatus.ACCEPTED,RequestStatus.ON_THE_WAY,RequestStatus.ARRIVED,RequestStatus.WORKING).mapToLong(requestRepository::countByStatus).sum();
        Long completedRequests = requestRepository.countByStatus(RequestStatus.COMPLETED) + requestRepository.countByStatus(RequestStatus.REVIEWED);

        BigDecimal revenue = paymentRepository.calculateTotalRevenue();
        if (revenue == null) revenue = BigDecimal.ZERO;

        return new AdminDashboardStats(
                totalUsers,
                totalCustomers,
                totalProviders,
                pendingVerifications,
                activeRequests,
                completedRequests,
                revenue
        );
    }

    @Override
    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserDto).toList();
    }

    @Override
    @Transactional
    public UserResponseDto createUser(RegisterCustomerRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email is already registered");
        }
        if (userRepository.existsByPhone(request.phone())) throw new BadRequestException("Phone number is already registered");
        if (request.password().getBytes(java.nio.charset.StandardCharsets.UTF_8).length > 72)
            throw new BadRequestException("Password must be at most 72 bytes");
        User user = new User();
        user.setFullName(request.fullName());
        user.setEmail(request.email());
        user.setPhone(request.phone());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(Role.CUSTOMER);
        user.setPreferredLanguage(request.preferredLanguage() != null ? request.preferredLanguage() : "en");

        User saved = userRepository.save(user);
        customerProfiles.save(new com.lankaease.entity.CustomerProfile(saved, request.defaultAddress(), request.latitude(), request.longitude()));
        return mapToUserDto(saved);
    }

    @Override
    @Transactional
    public UserResponseDto updateUser(Long userId, String fullName, String phone, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        if (fullName != null) {
            if (fullName.isBlank() || fullName.trim().length() > 100) throw new BadRequestException("Enter a full name of up to 100 characters");
            user.setFullName(fullName.trim());
        }
        if (phone != null) {
            if (phone.isBlank() || phone.trim().length() > 20) throw new BadRequestException("Enter a phone number of up to 20 characters");
            userRepository.findByPhone(phone.trim()).filter(other -> !other.getId().equals(userId)).ifPresent(other -> { throw new BadRequestException("Phone number is already registered"); });
            user.setPhone(phone.trim());
        }
        if (role != null) {
            Role selected;
            try {
                selected = Role.valueOf(role.toUpperCase(java.util.Locale.ROOT));
            } catch (IllegalArgumentException e) { throw new BadRequestException("Choose a valid user role"); }
            if (isCurrentUser(userId) && selected != Role.ADMIN) throw new BadRequestException("You cannot remove your own administrator role");
            user.setRole(selected);
            if (selected == Role.PROVIDER && providerRepository.findByUserId(userId).isEmpty()) {
                ProviderProfile profile = new ProviderProfile(); profile.setUser(user);
                profile.setBusinessName(user.getFullName() + " Services"); profile.setIsAvailable(false);
                providerRepository.save(profile);
            }
            if (selected == Role.CUSTOMER && customerProfiles.findByUserId(userId).isEmpty())
                customerProfiles.save(new com.lankaease.entity.CustomerProfile(user, null, null, null));
        }
        User saved = userRepository.save(user);
        return mapToUserDto(saved);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        if (isCurrentUser(userId)) throw new BadRequestException("You cannot delete your own administrator account");
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User", "id", userId);
        }
        if (!requestRepository.findByCustomerId(userId).isEmpty()) throw new BadRequestException("This user has service requests and cannot be deleted");
        providerRepository.findByUserId(userId).ifPresent(profile -> {
            if (!requestRepository.findByProviderId(profile.getId()).isEmpty()) throw new BadRequestException("This provider has service requests and cannot be deleted");
            providerRepository.delete(profile);
        });
        customerProfiles.findByUserId(userId).ifPresent(customerProfiles::delete);
        userRepository.deleteById(userId);
        userRepository.flush();
    }

    private boolean isCurrentUser(Long id) {
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.getPrincipal() instanceof com.lankaease.security.UserPrincipal principal && id.equals(principal.getId());
    }

    @Override
    @Transactional
    public ProviderResponseDto verifyProvider(Long providerId, VerificationStatus status, String adminNotes) {
        ProviderProfile provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("ProviderProfile", "id", providerId));

        provider.setVerificationStatus(status);
        provider.setIsVerified(status == VerificationStatus.APPROVED);

        ProviderProfile saved = providerRepository.save(provider);
        return mapToProviderDto(saved);
    }

    @Override
    @Transactional
    public void deleteProvider(Long providerId) {
        if (!providerRepository.existsById(providerId)) {
            throw new ResourceNotFoundException("ProviderProfile", "id", providerId);
        }
        providerRepository.deleteById(providerId);
    }

    @Override
    @Transactional
    public ServiceCategoryResponseDto createCategory(String name, String slug, String description, String iconName) {
        validateCategory(name, description, iconName);
        ServiceCategory cat = new ServiceCategory();
        cat.setName(name);
        cat.setSlug(categorySlug(slug == null || slug.isBlank() ? name : slug));
        cat.setDescription(description);
        cat.setIconName(iconName != null ? iconName : "Wrench");
        cat.setIsActive(true);
        ServiceCategory saved = categoryRepository.save(cat);
        return new ServiceCategoryResponseDto(saved.getId(), saved.getName(), saved.getSlug(), saved.getDescription(), saved.getIconName(), saved.getIsActive());
    }

    @Override
    @Transactional
    public ServiceCategoryResponseDto updateCategory(Long categoryId, String name, String description, String iconName, Boolean isActive) {
        ServiceCategory cat = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("ServiceCategory", "id", categoryId));
        validateCategory(name == null ? cat.getName() : name, description == null ? cat.getDescription() : description, iconName == null ? cat.getIconName() : iconName);
        if (name != null) {
            cat.setName(name);
            // Keep existing category links stable when the display name changes.
        }
        if (description != null) cat.setDescription(description);
        if (iconName != null) cat.setIconName(iconName);
        if (isActive != null) cat.setIsActive(isActive);
        ServiceCategory saved = categoryRepository.save(cat);
        return new ServiceCategoryResponseDto(saved.getId(), saved.getName(), saved.getSlug(), saved.getDescription(), saved.getIconName(), saved.getIsActive());
    }

    @Override
    @Transactional
    public void deleteCategory(Long categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException("ServiceCategory", "id", categoryId);
        }
        categoryRepository.deleteById(categoryId);
        categoryRepository.flush();
    }

    private String categorySlug(String value) {
        String slug = value.trim().toLowerCase(java.util.Locale.ROOT).replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        if (slug.isEmpty() || slug.length() > 100) throw new BadRequestException("Enter a category slug of 1 to 100 letters or numbers");
        return slug;
    }

    private void validateCategory(String name, String description, String icon) {
        if (name == null || name.isBlank() || name.length() > 100) throw new BadRequestException("Enter a category name of up to 100 characters");
        if (description == null || description.isBlank()) throw new BadRequestException("Enter a category description");
        if (icon != null && (icon.isBlank() || icon.length() > 50)) throw new BadRequestException("Enter an icon name of up to 50 characters");
    }

    private UserResponseDto mapToUserDto(User u) {
        return new UserResponseDto(
                u.getId(),
                u.getFullName(),
                u.getEmail(),
                u.getPhone(),
                u.getRole(),
                u.getPreferredLanguage(),
                u.getProfileImage(),
                u.getIsEmailVerified(),
                u.getCreatedAt()
        );
    }

    private ProviderResponseDto mapToProviderDto(ProviderProfile p) {
        return providerService.getProviderById(p.getId());
    }
}

