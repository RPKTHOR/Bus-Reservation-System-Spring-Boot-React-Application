package com.busreservation.dto;

import lombok.Data;

@Data
public class SeatDTO {
    private Long tripId;
    private String seatNumber;
    private String seatType;
}
