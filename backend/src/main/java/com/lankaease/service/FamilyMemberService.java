package com.lankaease.service;

import com.lankaease.dto.request.FamilyMemberRequestDto;
import com.lankaease.dto.response.FamilyMemberResponseDto;
import java.util.List;

public interface FamilyMemberService {
    List<FamilyMemberResponseDto> getCustomerFamilyMembers(Long customerId);
    FamilyMemberResponseDto addFamilyMember(FamilyMemberRequestDto dto, Long customerId);
    void deleteFamilyMember(Long familyMemberId, Long customerId);
}
