package com.busreservation.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.busreservation.dto.TripDTO;
import com.busreservation.entity.Seat;
import com.busreservation.entity.Trip;
import com.busreservation.dto.TripSummaryDTO;
import com.busreservation.service.SeatService;
import com.busreservation.service.TripService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/v1/trips")
@Tag(name = "Trip Management", description = "Trip scheduling and search")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;
    private final SeatService seatService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Schedule trip", description = "Schedules a new trip for a specific bus and route")
    public ResponseEntity<Trip> scheduleTrip(@RequestBody TripDTO tripDTO) {
        Trip createdTrip = tripService.scheduleTrip(tripDTO);
        return ResponseEntity.ok(createdTrip);
    }

    @GetMapping("/search")
    @Operation(summary = "Search trips", description = "Searches for available trips between origin and destination")
    public ResponseEntity<List<TripSummaryDTO>> searchTrips(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam String date) {
        List<Trip> trips = tripService.searchTrips(source, destination, date);
        List<TripSummaryDTO> tripSummaries = trips.stream().map(trip -> {
            TripSummaryDTO dto = new TripSummaryDTO();
            dto.setId(trip.getId());
            dto.setBusNumber(trip.getBus().getBusNumber());
            dto.setBusType(trip.getBus().getBusType());
            dto.setOperatorName(trip.getBus().getOperatorName());
            dto.setRouteSource(trip.getRoute().getSource());
            dto.setRouteDestination(trip.getRoute().getDestination());
            dto.setDepartureTime(trip.getDepartureTime());
            dto.setArrivalTime(trip.getArrivalTime());
            dto.setFare(trip.getFare());
            return dto;
        }).toList();
        return ResponseEntity.ok(tripSummaries);
    }

    @GetMapping("/{id}/seats")
    @Operation(summary = "Get trip seats", description = "Retrieves seat layout and availability for a specific trip")
    public ResponseEntity<List<Seat>> getTripSeats(@PathVariable Long id) {
        List<Seat> seats = seatService.getSeatsByTripId(id);
        return ResponseEntity.ok(seats);
    }

    @GetMapping("/{id}")
@Operation(summary = "Get trip details", description = "Retrieves details for a specific trip")
public ResponseEntity<Trip> getTripById(@PathVariable Long id) {
    Trip trip = tripService.getTripById(id);
    return ResponseEntity.ok(trip);
    }
}