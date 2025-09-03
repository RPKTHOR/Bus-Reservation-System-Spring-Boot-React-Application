package com.busreservation.service;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.busreservation.dto.AuthResponseDTO;
import com.busreservation.dto.LoginDTO;
import com.busreservation.dto.RegisterDTO;
import com.busreservation.entity.Role;
import com.busreservation.entity.User;
import com.busreservation.repository.RoleRepository;
import com.busreservation.repository.UserRepository;
import com.busreservation.security.JwtUtil;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public User register(RegisterDTO dto) {
        // Check if user already exists
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("User with this email already exists");
        }

        List<String> roleNames = List.copyOf(dto.getRoles());
        List<Role> validRoles = roleNames.stream()
            .map(roleName -> roleRepository.findByName(roleName))
            .filter(Objects::nonNull)
            .distinct()
            .collect(Collectors.toList());

        if (validRoles.isEmpty()) {
            throw new RuntimeException("No valid roles found");
        }

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRoles(new HashSet<>(validRoles));

        return userRepository.save(user);
    }

    public AuthResponseDTO login(LoginDTO dto) {
        User user = userRepository.findByEmail(dto.getEmail())
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }

        String token = jwtUtil.generateToken(user);
        return new AuthResponseDTO(
            token,
            user.getName(),
            user.getEmail(),
            user.getRoles().stream().map(Role::getName).collect(Collectors.toList())
        );
    }

    public boolean validateToken(String token) {
        try {
            String email = jwtUtil.extractEmail(token);
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            
            org.springframework.security.core.userdetails.UserDetails userDetails = 
                org.springframework.security.core.userdetails.User.builder()
                    .username(user.getEmail())
                    .password(user.getPassword())
                    .authorities(user.getRoles().stream()
                        .map(role -> "ROLE_" + role.getName().replace("ROLE_", ""))
                        .toArray(String[]::new))
                    .build();
            
            return jwtUtil.validateToken(token, userDetails);
        } catch (Exception e) {
            return false;
        }
    }
}