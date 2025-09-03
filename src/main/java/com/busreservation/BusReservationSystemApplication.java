package com.busreservation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.busreservation")
public class BusReservationSystemApplication {
    public static void main(String[] args) {
        SpringApplication.run(BusReservationSystemApplication.class, args);
    }
}

