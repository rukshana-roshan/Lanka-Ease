package com.lankaease.service.impl;

import com.lankaease.dto.request.FamilyMemberRequestDto;
import com.lankaease.dto.response.FamilyMemberResponseDto;
import com.lankaease.entity.FamilyMember;
import com.lankaease.entity.User;
import com.lankaease.exception.ResourceNotFoundException;
import com.lankaease.repository.FamilyMemberRepository;
import com.lankaease.repository.UserRepository;
import com.lankaease.service.FamilyMemberService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FamilyMemberServiceImpl implements FamilyMemberService {

    private final FamilyMemberRepository familyMemberRepository;
    private final UserRepository userRepository;

    public FamilyMemberServiceImpl(FamilyMemberRepository familyMemberRepository, UserRepository userRepository) {
        this.familyMemberRepository = familyMemberRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<FamilyMemberResponseDto> getCustomerFamilyMembers(Long customerId) {
        return familyMemberRepository.findByCustomerId(customerId).stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    @Transactional
    public FamilyMemberResponseDto addFamilyMember(FamilyMemberRequestDto dto, Long customerId) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", customerId));

        FamilyMember member = new FamilyMember(
                customer,
                dto.name(),
                dto.relationship(),
                dto.phone(),
                dto.address(),
                dto.latitude() != null ? dto.latitude() : 6.9147,
                dto.longitude() != null ? dto.longitude() : 79.8510
        );

        FamilyMember saved = familyMemberRepository.save(member);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public void deleteFamilyMember(Long familyMemberId, Long customerId) {
        FamilyMember member = familyMemberRepository.findById(familyMemberId)
                .orElseThrow(() -> new ResourceNotFoundException("FamilyMember", "id", familyMemberId));

        if (member.getCustomer().getId().equals(customerId)) {
            familyMemberRepository.delete(member);
        }
    }

    private FamilyMemberResponseDto mapToDto(FamilyMember fm) {
        return new FamilyMemberResponseDto(
                fm.getId(),
                fm.getName(),
                fm.getRelationship(),
                fm.getPhone(),
                fm.getAddress(),
                fm.getLatitude(),
                fm.getLongitude(),
                fm.getCreatedAt()
        );
    }
}
