package com.busreservation.service;

import org.springframework.stereotype.Service;

import com.busreservation.dto.TicketDTO;
import com.busreservation.entity.Booking;
import com.busreservation.repository.BookingRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final BookingRepository bookingRepository;

    public TicketDTO getTicket(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getStatus().equals("CONFIRMED")) {
            throw new RuntimeException("Ticket not available for unconfirmed booking");
        }

        String ticketNumber = "TKT-" + booking.getId();
        String qrCodeUrl = "https://yourdomain.com/qrcode/" + ticketNumber;
        String pdfUrl = "https://yourdomain.com/tickets/" + ticketNumber + ".pdf";

        return new TicketDTO(ticketNumber, qrCodeUrl, pdfUrl);
    }
}
