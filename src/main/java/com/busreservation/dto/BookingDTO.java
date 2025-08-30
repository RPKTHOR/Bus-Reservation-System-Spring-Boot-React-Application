package com.busreservation.dto;

import java.util.List;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class BookingDTO {
    private Long userId;
    private Long tripId;
    private List<String> seatNumbers;

    public BookingDTO() {
    }

    public BookingDTO(Long userId, Long tripId, List<String> seatNumbers) {
        this.userId = userId;
        this.tripId = tripId;
        this.seatNumbers = seatNumbers;
    }
}
