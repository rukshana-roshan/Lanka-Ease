package com.lankaease.controller;

import com.lankaease.dto.request.FamilyMemberRequestDto;
import com.lankaease.dto.response.FamilyMemberResponseDto;
import com.lankaease.security.UserPrincipal;
import com.lankaease.service.FamilyMemberService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/family")
public class FamilyMemberController {

    private final FamilyMemberService familyMemberService;

    public FamilyMemberController(FamilyMemberService familyMemberService) {
        this.familyMemberService = familyMemberService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<List<FamilyMemberResponseDto>> getFamilyMembers(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(familyMemberService.getCustomerFamilyMembers(userPrincipal.getId()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<FamilyMemberResponseDto> addFamilyMember(
            @Valid @RequestBody FamilyMemberRequestDto dto,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(familyMemberService.addFamilyMember(dto, userPrincipal.getId()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<Void> deleteFamilyMember(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        familyMemberService.deleteFamilyMember(id, userPrincipal.getId());
        return ResponseEntity.noContent().build();
    }
}
