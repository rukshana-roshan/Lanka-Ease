package com.lankaease.marketplace;
import com.lankaease.entity.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity @Table(name="marketplace_media")
public class MarketplaceMedia {
    @Id public String id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="owner_id",nullable=false) public User owner;
    @Column(nullable=false,length=20) public String purpose;
    @Column(name="content_type",nullable=false,length=50) public String contentType;
    @Column(nullable=false,columnDefinition="bytea") public byte[] content;
    @Column(name="created_at",nullable=false) public LocalDateTime createdAt=LocalDateTime.now();
}
