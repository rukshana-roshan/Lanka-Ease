package com.lankaease.util;

import com.lankaease.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Service
public class LocalFileStorageServiceImpl implements FileStorageService {

    private final Path uploadPath;

    public LocalFileStorageServiceImpl(@Value("${lankaease.upload.dir:./uploads}") String uploadDir) {
        this.uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    @Override
    public String storeFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("Failed to store empty file.");
        }

        var extensions = java.util.Map.of("image/jpeg", ".jpg", "image/png", ".png", "image/webp", ".webp", "image/gif", ".gif", "video/mp4", ".mp4", "video/webm", ".webm");
        String extension = extensions.get(Objects.toString(file.getContentType(), ""));
        if (extension == null || file.getSize() > 15L * 1024 * 1024) {
            throw new BadRequestException("Upload a supported image or video smaller than 15 MB.");
        }

        String newFilename = UUID.randomUUID().toString() + extension;

        try {
            Path targetLocation = this.uploadPath.resolve(newFilename);
            try (var input = file.getInputStream()) {
                Files.copy(input, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            }
            return "/uploads/" + newFilename;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + newFilename, ex);
        }
    }
}
