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
    private final JwtUtil jwtutil;

@Transactional
public User register(RegisterDTO dto) {
    // Defensive copy to avoid ConcurrentModificationException
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

    String token = jwtutil.generateToken(user); // ✅ Use this, not generateToken(email)

    return new AuthResponseDTO(token, user.getName(), user.getEmail(), user.getRoles());
}


}
