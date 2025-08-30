package com.busreservation.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.busreservation.dto.SalesReportDTO;
import com.busreservation.entity.Booking;
import com.busreservation.repository.BookingRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final BookingRepository bookingRepository;
 

    public SalesReportDTO generateSalesReport() {
        List<Booking> confirmedBookings = bookingRepository.findByStatus("CONFIRMED");

        double totalRevenue = confirmedBookings.stream()
            .mapToDouble(Booking::getTotalAmount)
            .sum();

        long totalBookings = confirmedBookings.size();

        Map<String, Long> routeCounts = confirmedBookings.stream()
            .collect(Collectors.groupingBy(
                b -> b.getTrip().getRoute().getSource() + " → " + b.getTrip().getRoute().getDestination(),
                Collectors.counting()
            ));

        String topRoute = routeCounts.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse("N/A");

        return new SalesReportDTO(totalRevenue, totalBookings, topRoute);
    }
}
