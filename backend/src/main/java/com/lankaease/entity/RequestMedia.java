package com.lankaease.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "request_media")
public class RequestMedia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private ServiceRequest request;

    @Column(name = "file_url", nullable = false, length = 500)
    private String fileUrl;

    @Column(name = "file_type", length = 50)
    private String fileType = "image";

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public RequestMedia() {}

    public RequestMedia(ServiceRequest request, String fileUrl, String fileType, String fileName) {
        this.request = request;
        this.fileUrl = fileUrl;
        this.fileType = fileType;
        this.fileName = fileName;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ServiceRequest getRequest() { return request; }
    public void setRequest(ServiceRequest request) { this.request = request; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
