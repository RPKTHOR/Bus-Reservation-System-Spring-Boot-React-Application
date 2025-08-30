package com.busreservation.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Setter
@Getter
@Table(name = "tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ticketNumber;
    private String qrCodeUrl;
    private String pdfUrl;

    @OneToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;
}
