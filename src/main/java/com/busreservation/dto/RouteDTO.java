package com.busreservation.dto;

import lombok.Data;

@Data
public class RouteDTO {
    private String source;
    private String destination;
    private double distance;
    private String duration;
}
