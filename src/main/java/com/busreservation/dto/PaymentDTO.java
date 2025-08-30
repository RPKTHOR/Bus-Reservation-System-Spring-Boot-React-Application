package com.busreservation.dto;

import lombok.Data;

@Data
public class PaymentDTO {
    private Long bookingId;
    private String gatewayRef;
    private String status;
}
