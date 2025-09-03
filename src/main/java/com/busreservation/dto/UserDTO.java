package com.busreservation.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class UserDTO {
    private String name;
    private String email;
    private String phone;
    private String password;
}
