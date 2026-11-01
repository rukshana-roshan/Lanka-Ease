package com.lankaease.marketplace;
import com.lankaease.entity.*;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Entity @Table(name="provider_services")
public class ProviderOffering {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="provider_id",nullable=false) private ProviderProfile provider;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="category_id",nullable=false) private ServiceCategory category;
    @Column(nullable=false,length=150) private String title;
    @Column(columnDefinition="TEXT",nullable=false) private String description;
    @Column(name="price_min",precision=10,scale=2,nullable=false) private BigDecimal priceMin;
    @Column(name="price_max",precision=10,scale=2,nullable=false) private BigDecimal priceMax;
    @Column(name="duration_minutes",nullable=false) private Integer durationMinutes;
    @Column(nullable=false) private boolean active=true;
    @Column(name="created_at",nullable=false) private LocalDateTime createdAt=LocalDateTime.now();
    public Long getId(){return id;}
    public void setId(Long value){this.id=value;}
    public ProviderProfile getProvider(){return provider;}
    public void setProvider(ProviderProfile value){this.provider=value;}
    public ServiceCategory getCategory(){return category;}
    public void setCategory(ServiceCategory value){this.category=value;}
    public String getTitle(){return title;}
    public void setTitle(String value){this.title=value;}
    public String getDescription(){return description;}
    public void setDescription(String value){this.description=value;}
    public BigDecimal getPriceMin(){return priceMin;}
    public void setPriceMin(BigDecimal value){this.priceMin=value;}
    public BigDecimal getPriceMax(){return priceMax;}
    public void setPriceMax(BigDecimal value){this.priceMax=value;}
    public Integer getDurationMinutes(){return durationMinutes;}
    public void setDurationMinutes(Integer value){this.durationMinutes=value;}
    public boolean getActive(){return active;}
    public void setActive(boolean value){this.active=value;}
    public LocalDateTime getCreatedAt(){return createdAt;}
    public void setCreatedAt(LocalDateTime value){this.createdAt=value;}
}
