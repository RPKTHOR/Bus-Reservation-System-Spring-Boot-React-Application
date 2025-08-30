package com.busreservation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TicketDTO {
    private String ticketNumber;
    private String qrCodeUrl;
    private String pdfUrl;
}
