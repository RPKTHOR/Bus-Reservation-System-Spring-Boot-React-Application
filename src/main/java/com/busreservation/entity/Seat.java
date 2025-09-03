package com.busreservation.entity;
import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
@Entity
@Table(name = "seats")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String seatNumber;
    private String seatType; // window, aisle
    private boolean isBooked;

    @ManyToOne
    @JsonBackReference(value = "trip-seats")
    @JoinColumn(name = "trip_id")
    private Trip trip;

    @ManyToOne
    @JsonBackReference(value = "booking-seats")
    @JoinColumn(name = "booking_id", nullable = true)
    private Booking booking;
}
