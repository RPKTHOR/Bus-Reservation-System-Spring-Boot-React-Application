package com.busreservation.controller;



import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.busreservation.dto.RouteDTO;
import com.busreservation.entity.Route;
import com.busreservation.service.RouteService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/routes")
@Tag(name = "Route Management", description = "Manage routes and stops")
@RequiredArgsConstructor
public class RouteController {

    private final RouteService routeService;


    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create route", description = "Adds a new route")
    public ResponseEntity<Route> createRoute(@RequestBody RouteDTO routeDTO) {
        return ResponseEntity.ok(routeService.createRoute(routeDTO));
    }

    @GetMapping
    @Operation(summary = "List routes", description = "Returns all routes")
    public ResponseEntity<Object> getAllRoutes() {
        return ResponseEntity.ok(routeService.getAllRoutes());
    }
}
