package com.busreservation.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.busreservation.dto.PaymentDTO;
import com.busreservation.entity.Booking;
import com.busreservation.entity.Payment;
import com.busreservation.repository.BookingRepository;
import com.busreservation.repository.PaymentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    public String processPayment(PaymentDTO dto) {
        Booking booking = bookingRepository.findById(dto.getBookingId())
            .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getStatus().equals("HOLD")) {
            throw new RuntimeException("Booking is not in HOLD state");
        }

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setGatewayRef(dto.getGatewayRef());
        payment.setStatus(dto.getStatus());
        payment.setPaymentDate(LocalDateTime.now());
        paymentRepository.save(payment);

        booking.setStatus("CONFIRMED");
        bookingRepository.save(booking);

        return "Payment successful and booking confirmed";
    }
}
