package com.lankaease.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lankaease.entity.*;
import com.lankaease.entity.enums.*;
import com.lankaease.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AccountIsolationTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    @Autowired UserRepository users;
    @Autowired ServiceCategoryRepository categories;
    @Autowired ServiceRequestRepository requests;
    @Autowired ProviderProfileRepository providers;
    @Autowired FamilyMemberRepository families;
    @Autowired ConversationRepository conversations;
    @Autowired MessageRepository messages;
    @Autowired ContactMessageRepository contacts;
    @Autowired PaymentRepository payments;
    @Autowired JwtTokenProvider jwt;
    @Autowired InvoiceRepository invoices;
    @Autowired com.lankaease.ai.AIService ai;
    User owner, stranger, worker;
    ServiceCategory category;
    ServiceRequest request;

    User user(Role role) {
        String unique = UUID.randomUUID().toString().substring(0, 8);
        return users.save(new User("Test User", unique + "@example.com", "07" + unique, "not-a-real-password", role));
    }
    String token(User user) { return jwt.generateTokenFromUserId(user.getId(), user.getEmail(), user.getRole().name(), 60000); }
    String bearer(User user) { return "Bearer " + token(user); }

    @BeforeEach void setup() {
        owner = user(Role.CUSTOMER); stranger = user(Role.CUSTOMER); worker = user(Role.PROVIDER);
        category = new ServiceCategory(); category.setName("Plumbing"); category.setSlug("plumbing-" + owner.getId()); category.setIconName("Droplet");
        categories.save(category);
        request = new ServiceRequest(); request.setRequestCode("REQ-" + UUID.randomUUID().toString().substring(0, 12));
        request.setCustomer(owner); request.setCategory(category); request.setAddress("Private home address"); request.setProblemDescription("Fix a tap");
        request = requests.save(request);
    }

    @Test void anonymousCannotReadPrivateRequest() throws Exception {
        mvc.perform(get("/api/requests/" + request.getId())).andExpect(status().isUnauthorized());
    }
    @Test void ownerCanReadButAnotherCustomerCannot() throws Exception {
        mvc.perform(get("/api/requests/" + request.getId()).header("Authorization", bearer(owner))).andExpect(status().isOk());
        mvc.perform(get("/api/requests/" + request.getId()).header("Authorization", bearer(stranger))).andExpect(status().isForbidden());
    }
    @Test void requestCodeDoesNotBypassOwnership() throws Exception {
        mvc.perform(get("/api/requests/code/" + request.getRequestCode()).header("Authorization", bearer(stranger))).andExpect(status().isForbidden());
    }
    @Test void customerCannotCompleteTheirOwnJobOrSetCharges() throws Exception {
        mvc.perform(patch("/api/requests/" + request.getId() + "/status").header("Authorization", bearer(owner))
                .contentType("application/json").content("{\"newStatus\":\"COMPLETED\",\"finalPrice\":1}"))
                .andExpect(status().isForbidden());
        assertEquals(RequestStatus.CREATED, request.getStatus());
    }
    @Test void ownerCanCancelAndNullStatusIsRejected() throws Exception {
        mvc.perform(patch("/api/requests/" + request.getId() + "/status").header("Authorization", bearer(owner))
                .contentType("application/json").content("{}"))
                .andExpect(status().isBadRequest());
        mvc.perform(patch("/api/requests/" + request.getId() + "/status").header("Authorization", bearer(owner))
                .contentType("application/json").content("{\"newStatus\":\"CANCELLED\"}"))
                .andExpect(status().isOk());
    }
    @Test void cannotCreateRequestForSomeoneElsesFamily() throws Exception {
        var family = families.save(new FamilyMember(stranger, "Parent", Relationship.MOTHER, "0771234567", "Another home", 6.9, 79.8));
        mvc.perform(post("/api/requests").header("Authorization", bearer(owner)).contentType("application/json")
                .content(json.writeValueAsString(Map.of("problemDescription", "Fix tap", "address", "Home", "categoryId", category.getId(), "familyMemberId", family.getId()))))
                .andExpect(status().isForbidden());
    }
    @Test void cannotPostIntoAnUnrelatedConversation() throws Exception {
        var conversation = conversations.save(new Conversation(owner, worker, null));
        long before = messages.count();
        mvc.perform(post("/api/conversations/" + conversation.getId() + "/messages").header("Authorization", bearer(stranger))
                .contentType("application/json").content("{\"textContent\":\"intrusion\"}"))
                .andExpect(status().isForbidden());
        assertEquals(before, messages.count());
    }
    @Test void refreshTokenCannotActAsAccessToken() throws Exception {
        String refresh = jwt.generateRefreshToken(UserPrincipal.create(owner));
        mvc.perform(get("/api/family").header("Authorization", "Bearer " + refresh)).andExpect(status().isUnauthorized());
        mvc.perform(post("/api/auth/refresh").param("refreshToken", token(owner))).andExpect(status().isUnauthorized());
    }
    @Test void disabledAccountCannotUseAnExistingAccessToken() throws Exception {
        owner.setIsEnabled(false); users.save(owner);
        mvc.perform(get("/api/family").header("Authorization", bearer(owner))).andExpect(status().isUnauthorized());
    }
    @Test void validContactIsPersistedAndInvalidContactRejected() throws Exception {
        long before = contacts.count();
        mvc.perform(post("/api/contact").contentType("application/json")
                .content("{\"name\":\"Test\",\"email\":\"test@example.com\",\"message\":\"Please help\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.id").isNumber());
        assertEquals(before + 1, contacts.count());
        mvc.perform(post("/api/contact").contentType("application/json").content("{}"))
                .andExpect(status().isBadRequest());
    }
    @Test void unsafeUploadTypeIsRejected() throws Exception {
        mvc.perform(multipart("/api/uploads").file(new MockMultipartFile("file", "page.html", "text/html", "<script>alert(1)</script>".getBytes()))
                .header("Authorization", bearer(owner))).andExpect(status().isBadRequest());
        mvc.perform(multipart("/api/uploads").file(new MockMultipartFile("file", "file.png", null, "unknown".getBytes()))
                .header("Authorization", bearer(owner))).andExpect(status().isBadRequest());
    }
    @Test void paymentsCannotReportSuccessWithoutConfiguredGateway() throws Exception {
        var provider = new ProviderProfile(); provider.setUser(worker); provider.setBusinessName("Test business"); providers.save(provider);
        request.setProvider(provider); request.setFinalPrice(new BigDecimal("2500")); requests.save(request);
        long before = payments.count();
        mvc.perform(post("/api/payments").header("Authorization", bearer(owner)).contentType("application/json")
                .content("{\"requestId\":" + request.getId() + ",\"paymentMethod\":\"CARD\",\"amount\":1}"))
                .andExpect(status().isBadRequest());
        assertEquals(before, payments.count());
    }
    @Test void privateInvoicesCannotBeReadOrDownloadedByAnotherCustomer() throws Exception {
        var provider = new ProviderProfile(); provider.setUser(worker); provider.setBusinessName("Test business"); providers.save(provider);
        request.setProvider(provider); requests.save(request);
        var invoice = new Invoice(); invoice.setInvoiceNumber("INV-" + UUID.randomUUID().toString().substring(0, 12));
        invoice.setRequest(request); invoice.setCustomer(owner); invoice.setProvider(provider);
        invoice.setLabourFee(new BigDecimal("2000")); invoice.setPartsFee(BigDecimal.ZERO); invoice.setServiceFee(new BigDecimal("200"));
        invoice.setTotalAmount(new BigDecimal("2200")); invoice.setPaymentStatus("PENDING"); invoices.save(invoice);
        mvc.perform(get("/api/invoices/" + invoice.getId()).header("Authorization", bearer(owner))).andExpect(status().isOk());
        mvc.perform(get("/api/invoices/" + invoice.getId()).header("Authorization", bearer(stranger))).andExpect(status().isForbidden());
        mvc.perform(get("/api/invoices/" + invoice.getId() + "/pdf").header("Authorization", bearer(stranger))).andExpect(status().isForbidden());
    }
    @Test void classificationDoesNotTreatCrackedLaptopAsAirConditioning() {
        assertEquals("computer-repair", ai.classifyServiceRequest("My laptop has a cracked screen").categorySlug());
        assertEquals("carpentry", ai.classifyServiceRequest("I need a carpenter for a wooden door").categorySlug());
        assertEquals("cleaning", ai.classifyServiceRequest("Please wash house and clean the sofa").categorySlug());
    }

}
