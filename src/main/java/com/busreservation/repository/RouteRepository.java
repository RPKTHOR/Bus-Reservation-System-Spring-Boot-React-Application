package com.busreservation.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.busreservation.entity.Route;

public interface RouteRepository extends JpaRepository<Route, Long> {
    
}
