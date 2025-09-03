package com.busreservation.controller;

import org.springframework.http.ResponseEntity;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.busreservation.dto.BookingDTO;
import com.busreservation.entity.Booking;
import com.busreservation.dto.BookingResponseDTO;
import com.busreservation.service.BookingService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/bookings")

@Tag(name = "Booking", description = "Booking and cancellation")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/hold")
    @PreAuthorize("hasRole('CUSTOMER')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Hold seats", description = "Places a temporary hold on selected seats for a trip")
    public ResponseEntity<BookingResponseDTO> holdSeats(@RequestBody BookingDTO bookingDTO) {
        Booking booking = bookingService.holdSeats(bookingDTO);
        BookingResponseDTO dto = mapToDTO(booking);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasRole('CUSTOMER')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Cancel booking", description = "Cancels a confirmed booking and processes any eligible refund")
    public ResponseEntity<String> cancelBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Get booking details", description = "Returns booking details by ID")
    public ResponseEntity<BookingResponseDTO> getBooking(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        BookingResponseDTO dto = mapToDTO(booking);
        return ResponseEntity.ok(dto);
    }

    private BookingResponseDTO mapToDTO(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());
        dto.setStatus(booking.getStatus());
        dto.setTotalAmount(booking.getTotalAmount());

        // Trip info
        if (booking.getTrip() != null) {
            BookingResponseDTO.TripInfo tripInfo = new BookingResponseDTO.TripInfo();
            tripInfo.setId(booking.getTrip().getId());
            tripInfo.setDepartureTime(booking.getTrip().getDepartureTime() != null ? booking.getTrip().getDepartureTime().toString() : null);
            tripInfo.setArrivalTime(booking.getTrip().getArrivalTime() != null ? booking.getTrip().getArrivalTime().toString() : null);
            tripInfo.setFare(booking.getTrip().getFare());
            // Bus info
            if (booking.getTrip().getBus() != null) {
                BookingResponseDTO.BusInfo busInfo = new BookingResponseDTO.BusInfo();
                busInfo.setId(booking.getTrip().getBus().getId());
                busInfo.setBusNumber(booking.getTrip().getBus().getBusNumber());
                busInfo.setBusType(booking.getTrip().getBus().getBusType());
                busInfo.setOperatorName(booking.getTrip().getBus().getOperatorName());
                tripInfo.setBus(busInfo);
            }
            // Route info
            if (booking.getTrip().getRoute() != null) {
                BookingResponseDTO.RouteInfo routeInfo = new BookingResponseDTO.RouteInfo();
                routeInfo.setId(booking.getTrip().getRoute().getId());
                routeInfo.setSource(booking.getTrip().getRoute().getSource());
                routeInfo.setDestination(booking.getTrip().getRoute().getDestination());
                tripInfo.setRoute(routeInfo);
            }
            dto.setTrip(tripInfo);
        }

        // Seats info
        if (booking.getSeats() != null) {
            List<BookingResponseDTO.SeatInfo> seatInfos = booking.getSeats().stream().map(seat -> {
                BookingResponseDTO.SeatInfo seatInfo = new BookingResponseDTO.SeatInfo();
                seatInfo.setId(seat.getId());
                seatInfo.setSeatNumber(seat.getSeatNumber());
                seatInfo.setSeatType(seat.getSeatType());
                return seatInfo;
            }).collect(java.util.stream.Collectors.toList());
            dto.setSeats(seatInfos);
        }
        return dto;
    }
}