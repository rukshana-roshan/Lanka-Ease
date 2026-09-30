package com.lankaease.service;

import com.lankaease.dto.response.ServiceCategoryResponseDto;
import java.util.List;

public interface ServiceCategoryService {
    List<ServiceCategoryResponseDto> getAllCategories();
    ServiceCategoryResponseDto getCategoryById(Long id);
    ServiceCategoryResponseDto getCategoryBySlug(String slug);
    ServiceCategoryResponseDto createCategory(ServiceCategoryResponseDto categoryDto);
    ServiceCategoryResponseDto updateCategory(Long id, ServiceCategoryResponseDto categoryDto);
    void deleteCategory(Long id);
}
