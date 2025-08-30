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

import lombok.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController{

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;



    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterDTO dto) {
    User savedUser = authService.register(dto);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }


    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginDTO dto) {
        logger.info("Login attempt for email: {}", dto.getEmail());
        try {
            AuthResponseDTO response = authService.login(dto);
            logger.info("Login successful for email: {}. Token generated: {}", dto.getEmail(), response.getToken());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Login failed for email: {}. Reason: {}", dto.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}

