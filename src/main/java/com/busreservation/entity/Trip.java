package com.busreservation.entity;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "trips")
@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "bus_id")
    private Bus bus;

    @ManyToOne
    @JoinColumn(name = "route_id")
    private Route route;

    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private double fare;

    @OneToMany(mappedBy = "trip")
    private List<Seat> seats;

    @OneToMany(mappedBy = "trip")
    private List<Booking> bookings;
}
