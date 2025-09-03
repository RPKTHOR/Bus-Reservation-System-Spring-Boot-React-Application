package com.busreservation.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
@Data
public class BookingResponseDTO {
    private Long id;
    private String status;
    private double totalAmount;
    private TripInfo trip;
    private List<SeatInfo> seats;

    @Data
    public static class TripInfo {
        private Long id;
        private String departureTime;
        private String arrivalTime;
        private double fare;
        private BusInfo bus;
        private RouteInfo route;
    }

    @Data
    public static class BusInfo {
        private Long id;
        private String busNumber;
        private String busType;
        private String operatorName;
    }

    @Data
    public static class RouteInfo {
        private Long id;
        private String source;
        private String destination;
    }

    @Data
    public static class SeatInfo {
        private Long id;
        private String seatNumber;
        private String seatType;
    }
}
