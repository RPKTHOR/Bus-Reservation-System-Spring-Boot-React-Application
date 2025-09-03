package com.busreservation.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class RegisterDTO {
    private String name;
    private String email;
    private String phone;
    private String password;
    private List<String> roles;

    public RegisterDTO() {}

    public RegisterDTO(String name, String email, String phone, String password, List<String> roles) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.roles = roles;
    }
}
