package com.busreservation.entity;
import java.time.LocalDateTime;
import java.util.List;
import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "bookings")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime bookingDate;
    private double totalAmount;
    private String status; // HOLD, CONFIRMED, CANCELLED

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JsonBackReference(value = "trip-bookings")
    @JoinColumn(name = "trip_id")
    private Trip trip;

    @OneToMany(mappedBy = "booking")
    @JsonManagedReference(value = "booking-seats")
    private List<Seat> seats;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
    private Payment payment;

}
