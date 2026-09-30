package com.lankaease.entity;

import com.lankaease.entity.enums.VerificationStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "verification_requests")
public class VerificationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", nullable = false)
    private ProviderProfile provider;

    @Column(name = "id_document_url", length = 500)
    private String idDocumentUrl;

    @Column(name = "business_document_url", length = 500)
    private String businessDocumentUrl;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private VerificationStatus status = VerificationStatus.PENDING;

    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;

    @Column(name = "submitted_at", updatable = false)
    private LocalDateTime submittedAt = LocalDateTime.now();

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    public VerificationRequest() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProviderProfile getProvider() { return provider; }
    public void setProvider(ProviderProfile provider) { this.provider = provider; }

    public String getIdDocumentUrl() { return idDocumentUrl; }
    public void setIdDocumentUrl(String idDocumentUrl) { this.idDocumentUrl = idDocumentUrl; }

    public String getBusinessDocumentUrl() { return businessDocumentUrl; }
    public void setBusinessDocumentUrl(String businessDocumentUrl) { this.businessDocumentUrl = businessDocumentUrl; }

    public VerificationStatus getStatus() { return status; }
    public void setStatus(VerificationStatus status) { this.status = status; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }
}
