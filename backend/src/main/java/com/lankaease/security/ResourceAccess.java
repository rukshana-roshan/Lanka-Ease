package com.lankaease.security;

import com.lankaease.entity.ServiceRequest;
import com.lankaease.entity.enums.Role;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.Objects;

/** Authorizes the people involved in a request, rather than any signed-in account. */
public final class ResourceAccess {
    private ResourceAccess() {}

    public static UserPrincipal currentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof UserPrincipal principal)) {
            throw new AccessDeniedException("Sign in to access this resource.");
        }
        return principal;
    }

    public static void requireRequest(ServiceRequest request) {
        var principal = currentUser();
        if (principal.getRole() == Role.ADMIN
                || Objects.equals(request.getCustomer().getId(), principal.getId())
                || (request.getProvider() != null
                    && Objects.equals(request.getProvider().getUser().getId(), principal.getId()))) return;
        throw new AccessDeniedException("This request belongs to another account.");
    }
}
