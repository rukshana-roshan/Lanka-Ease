package com.lankaease.service.impl;

import com.lankaease.dto.response.ServiceCategoryResponseDto;
import com.lankaease.entity.ServiceCategory;
import com.lankaease.exception.ResourceNotFoundException;
import com.lankaease.repository.ServiceCategoryRepository;
import com.lankaease.service.ServiceCategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ServiceCategoryServiceImpl implements ServiceCategoryService {

    private final ServiceCategoryRepository categoryRepository;

    public ServiceCategoryServiceImpl(ServiceCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<ServiceCategoryResponseDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public ServiceCategoryResponseDto getCategoryById(Long id) {
        ServiceCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ServiceCategory", "id", id));
        return mapToDto(category);
    }

    @Override
    public ServiceCategoryResponseDto getCategoryBySlug(String slug) {
        ServiceCategory category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("ServiceCategory", "slug", slug));
        return mapToDto(category);
    }

    @Override
    @Transactional
    public ServiceCategoryResponseDto createCategory(ServiceCategoryResponseDto dto) {
        ServiceCategory category = new ServiceCategory(
                dto.name(),
                dto.slug() != null ? dto.slug() : dto.name().toLowerCase().replaceAll("\\s+", "-"),
                dto.description(),
                dto.iconName() != null ? dto.iconName() : "Wrench"
        );
        ServiceCategory saved = categoryRepository.save(category);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public ServiceCategoryResponseDto updateCategory(Long id, ServiceCategoryResponseDto dto) {
        ServiceCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ServiceCategory", "id", id));

        if (dto.name() != null) category.setName(dto.name());
        if (dto.description() != null) category.setDescription(dto.description());
        if (dto.iconName() != null) category.setIconName(dto.iconName());
        if (dto.isActive() != null) category.setIsActive(dto.isActive());

        ServiceCategory saved = categoryRepository.save(category);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    private ServiceCategoryResponseDto mapToDto(ServiceCategory c) {
        return new ServiceCategoryResponseDto(
                c.getId(),
                c.getName(),
                c.getSlug(),
                c.getDescription(),
                c.getIconName(),
                c.getIsActive()
        );
    }
}
