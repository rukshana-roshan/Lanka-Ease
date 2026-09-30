package com.lankaease.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_areas")
public class ServiceArea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", nullable = false)
    private ProviderProfile provider;

    @Column(name = "city_name", nullable = false, length = 100)
    private String cityName;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public ServiceArea() {}

    public ServiceArea(ProviderProfile provider, String cityName, String district) {
        this.provider = provider;
        this.cityName = cityName;
        this.district = district;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProviderProfile getProvider() { return provider; }
    public void setProvider(ProviderProfile provider) { this.provider = provider; }

    public String getCityName() { return cityName; }
    public void setCityName(String cityName) { this.cityName = cityName; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
