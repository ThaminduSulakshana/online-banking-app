package com.bank.app.controller;

import com.bank.app.entity.Role;
import com.bank.app.entity.User;
import com.bank.app.payload.request.LoginRequest;
import com.bank.app.payload.request.SignupRequest;
import com.bank.app.payload.response.JwtResponse;
import com.bank.app.payload.response.MessageResponse;
import com.bank.app.repository.UserRepository;
import com.bank.app.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    /**
     * Authenticates a user and generates a JWT token upon successful login.
     * 
     * @param loginRequest contains username and password
     * @return JwtResponse containing the token and user details
     */
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();    
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        
        return ResponseEntity.ok(new JwtResponse(jwt, 
                                                 user.getId(), 
                                                 userDetails.getUsername(), 
                                                 user.getEmail(), 
                                                 roles));
    }

    /**
     * Registers a new user in the system.
     * 
     * @param signUpRequest contains username, email, password, and optionally a role
     * @return MessageResponse indicating successful registration or error
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        Role userRole = Role.ROLE_CUSTOMER; // default
        if (signUpRequest.getRole() != null && !signUpRequest.getRole().isEmpty()) {
            String roleStr = signUpRequest.getRole().iterator().next().toUpperCase();
            try {
                userRole = Role.valueOf(roleStr);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid role."));
            }
        }

        User user = User.builder()
                .username(signUpRequest.getUsername())
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .role(userRole)
                .mfaEnabled(false)
                .build();

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    /**
     * Resets a user's password. (Note: Currently unprotected endpoint, should be secured in production)
     * 
     * @param email user's email address
     * @param newPassword the new password to set
     * @return MessageResponse indicating success or error
     */
    @PostMapping("/password-reset")
    public ResponseEntity<?> resetPassword(@RequestParam String email, @RequestParam String newPassword) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found with this email."));
        }
        user.setPassword(encoder.encode(newPassword));
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("Password reset successfully."));
    }
}
