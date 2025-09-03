package com.busreservation.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class PaymentDTO {
    private Long bookingId;
    private String gatewayRef;
    private String status;
}
