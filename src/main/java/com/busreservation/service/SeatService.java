package com.busreservation.service;

import org.springframework.stereotype.Service;

import com.busreservation.entity.Seat;
import com.busreservation.entity.Trip;
import com.busreservation.repository.SeatRepository;

import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SeatService {
    
    private final SeatRepository seatRepository;

    public void generateSeatsForTrip(Trip trip) {
        int totalSeats = trip.getBus().getTotalSeats();
        List<Seat> seats = new ArrayList<>();
        
        for (int i = 1; i <= totalSeats; i++) {
            Seat seat = new Seat();
            seat.setSeatNumber(String.valueOf(i));
            seat.setSeatType(i % 4 <= 2 ? "window" : "aisle");
            seat.setBooked(false);
            seat.setTrip(trip);
            seats.add(seat);
        }
        
        seatRepository.saveAll(seats);
    }

    public List<Seat> getSeatsByTripId(Long tripId) {
        return seatRepository.findByTripId(tripId);
    }
}