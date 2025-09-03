package com.busreservation.controller;

import com.busreservation.dto.BusDTO;
import com.busreservation.entity.Bus;
import com.busreservation.service.BusService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/buses")
@Tag(name = "Bus Management", description = "Manage buses and seat layouts")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class BusController {

    private final BusService busService;

    @PostMapping
    @Operation(summary = "Create bus", description = "Adds a new bus with seat layout")
    public ResponseEntity<Bus> createBus(@RequestBody BusDTO busDTO) {
        Bus createdBus = busService.createBus(busDTO);
        return ResponseEntity.ok(createdBus);
    }

    @GetMapping
    @Operation(summary = "List all buses", description = "Retrieves all registered buses")
    public ResponseEntity<List<Bus>> getAllBuses() {
        List<Bus> buses = busService.getAllBuses();
        return ResponseEntity.ok(buses);
    }
}
