package com.busreservation.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.busreservation.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {}
