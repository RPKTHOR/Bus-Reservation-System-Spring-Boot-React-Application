package com.busreservation.entity;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

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
    @JsonBackReference(value = "bus-trips")
    @JoinColumn(name = "bus_id")
    @JsonIgnore
    private Bus bus;

    @ManyToOne
    @JsonBackReference(value = "route-trips")
    @JoinColumn(name = "route_id")
    private Route route;

    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private double fare;

    @OneToMany(mappedBy = "trip")
    @JsonManagedReference(value = "trip-seats")
    private List<Seat> seats;

    @OneToMany(mappedBy = "trip")
    @JsonManagedReference(value = "trip-bookings")
    private List<Booking> bookings;
}
