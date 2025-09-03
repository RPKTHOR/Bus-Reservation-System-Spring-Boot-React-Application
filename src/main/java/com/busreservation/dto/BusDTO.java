package com.busreservation.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class BusDTO {
    private String busNumber;
    private String busType;
    private int totalSeats;
    private String operatorName;

    public BusDTO() {}

    public BusDTO(String busNumber, String busType, int totalSeats, String operatorName) {
        this.busNumber = busNumber;
        this.busType = busType;
        this.totalSeats = totalSeats;
        this.operatorName = operatorName;
    }

}
