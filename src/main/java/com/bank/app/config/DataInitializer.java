package com.bank.app.config;

import com.bank.app.entity.Role;
import com.bank.app.entity.User;
import com.bank.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@bank.com")
                    .password(encoder.encode("admin123"))
                    .role(Role.ROLE_ADMIN)
                    .mfaEnabled(false)
                    .build();
            userRepository.save(admin);
            System.out.println("Default admin user created for Apex Financial: admin / admin123");
        }
    }
}
