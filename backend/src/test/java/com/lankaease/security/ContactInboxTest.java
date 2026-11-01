package com.lankaease.security;

import com.lankaease.entity.ContactMessage;
import com.lankaease.repository.ContactMessageRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class ContactInboxTest {
    @Autowired MockMvc mvc;
    @Autowired ContactMessageRepository repository;

    @Test void anonymousCannotReadInbox() throws Exception {
        mvc.perform(get("/api/admin/contact-messages")).andExpect(status().isUnauthorized());
    }
    @Test @WithMockUser(roles = "CUSTOMER") void customerCannotReadInbox() throws Exception {
        mvc.perform(get("/api/admin/contact-messages")).andExpect(status().isForbidden());
    }
    @Test @WithMockUser(roles = "PROVIDER") void providerCannotReadInbox() throws Exception {
        mvc.perform(get("/api/admin/contact-messages")).andExpect(status().isForbidden());
    }
    @Test @WithMockUser(roles = "ADMIN") void adminReadsPersistedMessagesNewestFirstWithPagination() throws Exception {
        repository.deleteAll();
        repository.saveAndFlush(new ContactMessage("Older sender", "older@example.com", null, null, "First message"));
        var latest = repository.saveAndFlush(new ContactMessage("Customer", "customer@example.com", "+94770000000", "Help", "Please contact me"));
        mvc.perform(get("/api/admin/contact-messages").param("size", "1"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.totalElements").value(2))
                .andExpect(jsonPath("$.totalPages").value(2)).andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].id").value(latest.getId()))
                .andExpect(jsonPath("$.content[0].email").value("customer@example.com"))
                .andExpect(jsonPath("$.content[0].message").value("Please contact me"))
                .andExpect(jsonPath("$.content[0].createdAt").isNotEmpty());
        mvc.perform(get("/api/admin/contact-messages").param("size", "1").param("page", "1"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.content[0].name").value("Older sender"));
    }
    @Test @WithMockUser(roles = "ADMIN") void rejectsUnboundedOrNegativePagination() throws Exception {
        mvc.perform(get("/api/admin/contact-messages").param("size", "100000")).andExpect(status().isBadRequest());
        mvc.perform(get("/api/admin/contact-messages").param("page", "-1")).andExpect(status().isBadRequest());
    }
}
