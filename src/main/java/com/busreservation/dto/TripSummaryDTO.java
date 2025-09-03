package com.busreservation.dto;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
public class TripSummaryDTO {
    private Long id;
    private String busNumber;
    private String busType;
    private String operatorName;
    private String routeSource;
    private String routeDestination;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private double fare;
}
