package com.lankaease.entity;

import com.lankaease.entity.enums.VerificationStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "provider_profiles")
public class ProviderProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "business_name", length = 150)
    private String businessName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "experience_years")
    private Integer experienceYears = 1;

    @Column(name = "price_min", precision = 10, scale = 2)
    private BigDecimal priceMin = new BigDecimal("1000.00");

    @Column(name = "price_max", precision = 10, scale = 2)
    private BigDecimal priceMax = new BigDecimal("5000.00");

    @Column(name = "is_verified")
    private Boolean isVerified = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", length = 20)
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    @Column(name = "rating_avg", precision = 3, scale = 2)
    private BigDecimal ratingAvg = new BigDecimal("5.00");

    @Column(name = "jobs_completed_count")
    private Integer jobsCompletedCount = 0;

    @Column(name = "response_time_minutes")
    private Integer responseTimeMinutes = 15;

    @Column(name = "is_available")
    private Boolean isAvailable = true;

    @Column(name = "current_latitude")
    private Double currentLatitude;

    @Column(name = "current_longitude")
    private Double currentLongitude;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "provider_categories",
        joinColumns = @JoinColumn(name = "provider_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<ServiceCategory> categories = new HashSet<>();

    @OneToMany(mappedBy = "provider", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ServiceArea> serviceAreas = new HashSet<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public ProviderProfile() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public BigDecimal getPriceMin() { return priceMin; }
    public void setPriceMin(BigDecimal priceMin) { this.priceMin = priceMin; }

    public BigDecimal getPriceMax() { return priceMax; }
    public void setPriceMax(BigDecimal priceMax) { this.priceMax = priceMax; }

    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }

    public VerificationStatus getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(VerificationStatus verificationStatus) { this.verificationStatus = verificationStatus; }

    public BigDecimal getRatingAvg() { return ratingAvg; }
    public void setRatingAvg(BigDecimal ratingAvg) { this.ratingAvg = ratingAvg; }

    public Integer getJobsCompletedCount() { return jobsCompletedCount; }
    public void setJobsCompletedCount(Integer jobsCompletedCount) { this.jobsCompletedCount = jobsCompletedCount; }

    public Integer getResponseTimeMinutes() { return responseTimeMinutes; }
    public void setResponseTimeMinutes(Integer responseTimeMinutes) { this.responseTimeMinutes = responseTimeMinutes; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }

    public Double getCurrentLatitude() { return currentLatitude; }
    public void setCurrentLatitude(Double currentLatitude) { this.currentLatitude = currentLatitude; }

    public Double getCurrentLongitude() { return currentLongitude; }
    public void setCurrentLongitude(Double currentLongitude) { this.currentLongitude = currentLongitude; }

    public Set<ServiceCategory> getCategories() { return categories; }
    public void setCategories(Set<ServiceCategory> categories) { this.categories = categories; }

    public Set<ServiceArea> getServiceAreas() { return serviceAreas; }
    public void setServiceAreas(Set<ServiceArea> serviceAreas) { this.serviceAreas = serviceAreas; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
