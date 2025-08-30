package com.busreservation.service;

import org.springframework.stereotype.Service;

import com.busreservation.dto.RouteDTO;
import com.busreservation.entity.Route;
import com.busreservation.repository.RouteRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RouteService {
    private final RouteRepository routeRepository;

    public Route createRoute(RouteDTO dto) {
        Route route = new Route();
        route.setSource(dto.getSource());
        route.setDestination(dto.getDestination());
        route.setDistance(dto.getDistance());
        route.setDuration(dto.getDuration());
        return routeRepository.save(route);
    }

    public Object getAllRoutes() {
      
        throw new UnsupportedOperationException("Unimplemented method 'getAllRoutes'");
    }
}
