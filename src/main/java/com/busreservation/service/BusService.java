package com.busreservation.service;

import org.springframework.stereotype.Service;
import com.busreservation.dto.BusDTO;
import com.busreservation.entity.Bus;
import com.busreservation.repository.BusRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BusService {

    private final BusRepository busRepository;

    public Bus createBus(BusDTO dto) {
        Bus bus = new Bus();
        bus.setBusNumber(dto.getBusNumber());
        bus.setBusType(dto.getBusType());
        bus.setTotalSeats(dto.getTotalSeats());
        bus.setOperatorName(dto.getOperatorName());
        return busRepository.save(bus);
    }

    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }
}
