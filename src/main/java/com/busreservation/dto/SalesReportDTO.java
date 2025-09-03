package com.busreservation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
@AllArgsConstructor
public class SalesReportDTO {
    private double totalRevenue;
    private long totalBookings;
    private String topRoute;
}
