package com.busreservation.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

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
    @JsonIgnore
    @JsonManagedReference(value = "bus-trips")
    private List<Trip> trips;
}
