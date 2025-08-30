package com.busreservation.entity;
import java.util.List;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "routes")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String source;
    private String destination;
    private double distance;
    private String duration;

    @OneToMany(mappedBy = "route")
    private List<Trip> trips;

    
}
