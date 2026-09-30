package com.lankaease.entity;

import com.lankaease.entity.enums.RequestStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "request_status_history")
public class RequestStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private ServiceRequest request;

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_status", length = 30)
    private RequestStatus previousStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_status", nullable = false, length = 30)
    private RequestStatus newStatus;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by_user_id")
    private User updatedByUser;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public RequestStatusHistory() {}

    public RequestStatusHistory(ServiceRequest request, RequestStatus previousStatus, RequestStatus newStatus, String notes, User updatedByUser) {
        this.request = request;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.notes = notes;
        this.updatedByUser = updatedByUser;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ServiceRequest getRequest() { return request; }
    public void setRequest(ServiceRequest request) { this.request = request; }

    public RequestStatus getPreviousStatus() { return previousStatus; }
    public void setPreviousStatus(RequestStatus previousStatus) { this.previousStatus = previousStatus; }

    public RequestStatus getNewStatus() { return newStatus; }
    public void setNewStatus(RequestStatus newStatus) { this.newStatus = newStatus; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public User getUpdatedByUser() { return updatedByUser; }
    public void setUpdatedByUser(User updatedByUser) { this.updatedByUser = updatedByUser; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
