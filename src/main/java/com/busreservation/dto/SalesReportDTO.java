package com.busreservation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SalesReportDTO {
    private double totalRevenue;
    private long totalBookings;
    private String topRoute;
}
