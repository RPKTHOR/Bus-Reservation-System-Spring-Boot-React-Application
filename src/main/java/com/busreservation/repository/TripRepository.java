package com.busreservation.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.busreservation.entity.Trip;

public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByRoute_SourceAndRoute_DestinationAndDepartureTimeBetween(
        String source, String destination, LocalDateTime start, LocalDateTime end);
}