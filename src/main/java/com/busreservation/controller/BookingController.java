package com.busreservation.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.busreservation.dto.BookingDTO;
import com.busreservation.entity.Booking;
import com.busreservation.service.BookingService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/bookings")
@Tag(name = "Booking", description = "Seat hold and booking confirmation")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/hold")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Hold seats", description = "Places a temporary hold on selected seats")
    public ResponseEntity<Booking> holdSeats(@RequestBody BookingDTO bookingDTO) {
        return ResponseEntity.ok(bookingService.holdSeats(bookingDTO));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Cancel booking", description = "Cancels a confirmed booking and processes refund")
    public ResponseEntity<String> cancelBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }
}
