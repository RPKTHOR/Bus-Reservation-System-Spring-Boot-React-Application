package com.busreservation.service;

import org.springframework.stereotype.Service;

import com.busreservation.dto.TripDTO;
import com.busreservation.entity.Trip;
import com.busreservation.repository.BusRepository;
import com.busreservation.repository.RouteRepository;
import com.busreservation.repository.TripRepository;

import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TripService {
    private final TripRepository tripRepository;
    private final BusRepository busRepository;
    private final RouteRepository routeRepository;
    private final SeatService seatService;

    public Trip scheduleTrip(TripDTO dto) {
        Trip trip = new Trip();
        trip.setBus(busRepository.findById(dto.getBusId())
            .orElseThrow(() -> new RuntimeException("Bus not found")));
        trip.setRoute(routeRepository.findById(dto.getRouteId())
            .orElseThrow(() -> new RuntimeException("Route not found")));
        trip.setDepartureTime(dto.getDepartureTime());
        trip.setArrivalTime(dto.getArrivalTime());
        trip.setFare(dto.getFare());
        
        Trip savedTrip = tripRepository.save(trip);
        
        // Generate seats for this trip
        seatService.generateSeatsForTrip(savedTrip);
        
        return savedTrip;
    }

    public Trip getTripById(Long id) {
    return tripRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Trip not found"));
}

    public List<Trip> searchTrips(String source, String destination, String date) {
        LocalDate searchDate = LocalDate.parse(date);
        LocalDateTime startOfDay = searchDate.atStartOfDay();
        LocalDateTime endOfDay = searchDate.atTime(23, 59, 59);
        
        return tripRepository.findByRoute_SourceAndRoute_DestinationAndDepartureTimeBetween(
            source, destination, startOfDay, endOfDay);
    }
}