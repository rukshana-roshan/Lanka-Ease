package com.lankaease.marketplace;
import com.lankaease.entity.ProviderProfile;
import jakarta.persistence.*;
@Entity @Table(name="provider_details")
public class ProviderDetails {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
    @OneToOne(fetch=FetchType.LAZY) @JoinColumn(name="provider_id",nullable=false,unique=true) public ProviderProfile provider;
    @Column(length=100) public String province;
    @Column(length=100) public String district;
    @Column(length=100) public String city;
    @Column(length=150) public String subcategory;
    @Column(name="availability_status",length=20,nullable=false) public String availabilityStatus="AVAILABLE";
    @Column(name="configuration_json",columnDefinition="TEXT",nullable=false) public String configurationJson="{}";
}
