package com.busreservation.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class SeatDTO {
    private Long tripId;
    private String seatNumber;
    private String seatType;
}
