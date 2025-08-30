package com.busreservation.entity;

import java.util.List;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "buses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String busNumber;
    private String busType; // AC, Non-AC, Sleeper
    private int totalSeats;
    private String operatorName;

    @OneToMany(mappedBy = "bus")
    private List<Trip> trips;
}
