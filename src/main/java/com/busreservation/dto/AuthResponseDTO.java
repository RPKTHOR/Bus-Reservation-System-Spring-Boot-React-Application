package com.busreservation.dto;

import java.util.Set;

import com.busreservation.entity.Role;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@NoArgsConstructor
public class AuthResponseDTO {
    private String token;
    private String name;
    private String email;
    private Set<Role> roles;

    public AuthResponseDTO(String token, String name, String email, Set<Role> roles) {
        this.token = token;
        this.name = name;
        this.email = email;
        this.roles = roles;
    }

    

}

