package com.lankaease.controller;

import com.lankaease.util.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {
    private final FileStorageService storage;
    public UploadController(FileStorageService storage) { this.storage = storage; }
    @PostMapping
    public ResponseEntity<Map<String, String>> upload(@RequestPart("file") MultipartFile file) {
        return ResponseEntity.ok(Map.of("url", storage.storeFile(file)));
    }
}
