package com.lankaease.marketplace;
import com.lankaease.entity.*;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity @Table(name="provider_reports")
public class ProviderReport {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="provider_id",nullable=false) public ProviderProfile provider;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="reporter_id",nullable=false) public User reporter;
    @Column(name="review_id") public Long reviewId;
    @Column(columnDefinition="TEXT",nullable=false) public String reason;
    @Column(nullable=false,length=20) public String status="OPEN";
    @Column(name="admin_notes",columnDefinition="TEXT") public String adminNotes;
    @Column(name="created_at",nullable=false) public LocalDateTime createdAt=LocalDateTime.now();
}
