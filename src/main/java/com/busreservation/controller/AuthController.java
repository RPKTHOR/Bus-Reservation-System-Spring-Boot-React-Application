package com.busreservation.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.busreservation.dto.AuthResponseDTO;
import com.busreservation.dto.LoginDTO;
import com.busreservation.dto.RegisterDTO;
import com.busreservation.entity.User;
import com.busreservation.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = {"http://localhost:3001"})
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO dto) {
        try {
            User savedUser = authService.register(dto);
            logger.info("User registered successfully: {}", dto.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        } catch (Exception e) {
            logger.error("Registration failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        logger.info("Login attempt for email: {}", dto.getEmail());
        try {
            AuthResponseDTO response = authService.login(dto);
            logger.info("Login successful for email: {}", dto.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Login failed for email: {}. Reason: {}", dto.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("Invalid credentials"));
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        try {
            // Remove Bearer prefix if present
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            boolean isValid = authService.validateToken(token);
            return ResponseEntity.ok(new TokenValidationResponse(isValid));
        } catch (Exception e) {
            return ResponseEntity.ok(new TokenValidationResponse(false));
        }
    }

    // Inner classes for responses
    public static class ErrorResponse {
        private String message;
        private long timestamp = System.currentTimeMillis();

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() { return message; }
        public long getTimestamp() { return timestamp; }
    }

    public static class TokenValidationResponse {
        private boolean valid;

        public TokenValidationResponse(boolean valid) {
            this.valid = valid;
        }

        public boolean isValid() { return valid; }
    }
}