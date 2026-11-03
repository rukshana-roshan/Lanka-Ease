package com.lankaease.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lankaease.entity.User;
import com.lankaease.entity.enums.Role;
import com.lankaease.repository.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AdminCrudTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    @Autowired UserRepository users;
    @Autowired CustomerProfileRepository customers;
    @Autowired ProviderProfileRepository providers;
    @Autowired JwtTokenProvider jwt;
    String body() throws Exception {
        String unique = UUID.randomUUID().toString();
        return json.writeValueAsString(Map.of("fullName", "Created user", "email", unique+"@example.com", "phone", unique.substring(0,18), "password", "test-password"));
    }
    @Test @WithMockUser(roles="ADMIN") void userCrudPersistsAndRemovesProfile() throws Exception {
        var created = mvc.perform(post("/api/admin/users").contentType("application/json").content(body()))
            .andExpect(status().isOk()).andExpect(jsonPath("$.role").value("CUSTOMER")).andReturn();
        long id=json.readTree(created.getResponse().getContentAsString()).get("id").asLong();
        assertTrue(customers.findByUserId(id).isPresent());
        mvc.perform(get("/api/admin/users")).andExpect(status().isOk());
        mvc.perform(put("/api/admin/users/"+id).param("fullName","Updated user").param("role","PROVIDER"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.fullName").value("Updated user"));
        assertTrue(providers.findByUserId(id).isPresent());
        mvc.perform(delete("/api/admin/users/"+id)).andExpect(status().isNoContent());
        assertFalse(users.existsById(id)); assertTrue(customers.findByUserId(id).isEmpty());
    }
    @Test @WithMockUser(roles="ADMIN") void categoryCrudKeepsSlugStable() throws Exception {
        var created=mvc.perform(post("/api/admin/categories").param("name","Test "+UUID.randomUUID()).param("slug","unique-"+UUID.randomUUID()).param("description","Test category").param("iconName","Wrench"))
            .andExpect(status().isOk()).andReturn();
        var category=json.readTree(created.getResponse().getContentAsString()); long id=category.get("id").asLong();
        mvc.perform(put("/api/admin/categories/"+id).param("name","Renamed "+UUID.randomUUID()).param("isActive","false"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.slug").value(category.get("slug").asText())).andExpect(jsonPath("$.isActive").value(false));
        mvc.perform(delete("/api/admin/categories/"+id)).andExpect(status().isNoContent());
        mvc.perform(get("/api/services/"+id)).andExpect(status().isNotFound());
    }
    @Test @WithMockUser(roles="ADMIN") void invalidInputAndDuplicateUsersAreRejected() throws Exception {
        mvc.perform(post("/api/admin/users").contentType("application/json").content("{}" )).andExpect(status().isBadRequest());
        String body=body();
        var result=mvc.perform(post("/api/admin/users").contentType("application/json").content(body)).andExpect(status().isOk()).andReturn();
        long id=json.readTree(result.getResponse().getContentAsString()).get("id").asLong();
        mvc.perform(post("/api/admin/users").contentType("application/json").content(body)).andExpect(status().isBadRequest());
        mvc.perform(put("/api/admin/users/"+id).param("role","INVALID")).andExpect(status().isBadRequest());
        mvc.perform(post("/api/admin/categories").param("name"," ").param("description","Test")).andExpect(status().isBadRequest());
    }
    @Test void administratorCannotDeleteOrDemoteSelf() throws Exception {
        User admin=users.saveAndFlush(new User("Admin",UUID.randomUUID()+"@example.com",UUID.randomUUID().toString().substring(0,18),"unused",Role.ADMIN));
        String bearer="Bearer "+jwt.generateTokenFromUserId(admin.getId(),admin.getEmail(),"ADMIN",60000);
        mvc.perform(delete("/api/admin/users/"+admin.getId()).header("Authorization",bearer)).andExpect(status().isBadRequest());
        mvc.perform(put("/api/admin/users/"+admin.getId()).header("Authorization",bearer).param("role","CUSTOMER")).andExpect(status().isBadRequest());
    }
    @Test @WithMockUser(roles="CUSTOMER") void customerCannotChangeAdminRecords() throws Exception {
        mvc.perform(post("/api/admin/users").contentType("application/json").content(body())).andExpect(status().isForbidden());
        mvc.perform(delete("/api/admin/users/1")).andExpect(status().isForbidden());
        mvc.perform(post("/api/admin/categories").param("name","Test").param("description","Test")).andExpect(status().isForbidden());
    }
}
