package com.busreservation.entity;
import jakarta.persistence.*;
import lombok.*;
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
    @JoinColumn(name = "trip_id")
    private Trip trip;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = true)
    private Booking booking;
}
