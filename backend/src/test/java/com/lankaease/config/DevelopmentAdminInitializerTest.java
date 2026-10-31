package com.lankaease.config;

import com.lankaease.entity.User;
import com.lankaease.entity.enums.Role;
import com.lankaease.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DevelopmentAdminInitializerTest {
    @Configuration(proxyBeanMethods = false)
    @Import({DevelopmentAdminInitializer.class, DataInitializer.class})
    static class Initializers {}

    @Test void createsBcryptAdminEvenWhenOtherDemoDataAlreadyExists() {
        var users = mock(UserRepository.class);
        new DevelopmentAdminInitializer(users).run();
        var saved = ArgumentCaptor.forClass(User.class);
        verify(users).save(saved.capture());
        assertEquals(Role.ADMIN, saved.getValue().getRole());
        assertEquals(DevelopmentAdminInitializer.EMAIL, saved.getValue().getEmail());
        char[] requestedPassword = {97, 100, 109, 105, 110, 49, 50, 51, 52};
        assertTrue(new BCryptPasswordEncoder().matches(new String(requestedPassword), saved.getValue().getPasswordHash()));
        java.util.Arrays.fill(requestedPassword, '\0');
    }

    @Test void neverResetsOrPromotesAnExistingAccount() {
        var users = mock(UserRepository.class);
        when(users.existsByEmail(DevelopmentAdminInitializer.EMAIL)).thenReturn(true);
        new DevelopmentAdminInitializer(users).run();
        verify(users, never()).save(any());
    }

    @Test void neitherInitializerExistsInProductionIncludingMixedProfiles() {
        for (String profiles : new String[]{"prod", "dev,prod", "test"}) {
            new ApplicationContextRunner().withPropertyValues("spring.profiles.active=" + profiles)
                    .withUserConfiguration(Initializers.class).run(context -> {
                        assertNull(context.getStartupFailure());
                        assertEquals(0, context.getBeansOfType(DevelopmentAdminInitializer.class).size());
                        assertEquals(0, context.getBeansOfType(DataInitializer.class).size());
                    });
        }
    }
}
