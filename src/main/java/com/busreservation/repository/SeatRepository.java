package com.busreservation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.busreservation.entity.Seat;

public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByTripId(Long tripId);
}