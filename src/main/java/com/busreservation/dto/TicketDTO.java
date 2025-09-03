package com.busreservation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@AllArgsConstructor
public class TicketDTO {
    private String ticketNumber;
    private String qrCodeUrl;
    private String pdfUrl;
}
