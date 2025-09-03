package com.busreservation.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class RouteDTO {
    private String source;
    private String destination;
    private double distance;
    private String duration;

    public RouteDTO() {
    }

    public RouteDTO(String source, String destination, double distance, String duration) {
        this.source = source;
        this.destination = destination;
        this.distance = distance;
        this.duration = duration;
    }
}
