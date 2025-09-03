package com.busreservation.entity;
import java.util.List;
import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;

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
    @JsonManagedReference(value = "route-trips")
    private List<Trip> trips;

    
}
