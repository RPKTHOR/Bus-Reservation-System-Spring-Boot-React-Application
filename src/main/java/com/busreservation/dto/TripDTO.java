package com.busreservation.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class TripDTO {
    private Long busId;
    private Long routeId;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private double fare;
}
