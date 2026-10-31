package com.lankaease.config;

import com.lankaease.entity.User;
import com.lankaease.entity.enums.Role;
import com.lankaease.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/** Local development account only. Never resets or elevates an existing user. */
@Component
@Profile("dev & !prod")
public class DevelopmentAdminInitializer implements CommandLineRunner {
    public static final String EMAIL = "admin@lankaease.local";
    private static final String PASSWORD_HASH = "$2a$12$hp7YK26kxyt7JrAk5qE0qucx6uyU2evMOyRSFW4xGrgJiJNfKRjDG";
    private final UserRepository users;

    public DevelopmentAdminInitializer(UserRepository users) {
        this.users = users;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (users.existsByEmail(EMAIL)) return;
        User admin = new User("Development Administrator", EMAIL, "+94000000000", PASSWORD_HASH, Role.ADMIN);
        admin.setIsEnabled(true);
        admin.setIsEmailVerified(true);
        users.save(admin);
    }
}
