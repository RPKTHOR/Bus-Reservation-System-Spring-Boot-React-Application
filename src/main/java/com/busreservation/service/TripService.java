package com.busreservation.service;

import org.springframework.stereotype.Service;

import com.busreservation.dto.TripDTO;
import com.busreservation.entity.Trip;
import com.busreservation.repository.BusRepository;
import com.busreservation.repository.RouteRepository;
import com.busreservation.repository.TripRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TripService {
    private final TripRepository tripRepository;
    private final BusRepository busRepository;
    private final RouteRepository routeRepository;

    public Trip scheduleTrip(TripDTO dto) {
        Trip trip = new Trip();
        trip.setBus(busRepository.findById(dto.getBusId()).orElseThrow());
        trip.setRoute(routeRepository.findById(dto.getRouteId()).orElseThrow());
        trip.setDepartureTime(dto.getDepartureTime());
        trip.setArrivalTime(dto.getArrivalTime());
        trip.setFare(dto.getFare());
        return tripRepository.save(trip);
    }
}
