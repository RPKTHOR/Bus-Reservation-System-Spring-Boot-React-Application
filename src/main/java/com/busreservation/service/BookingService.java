package com.busreservation.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.busreservation.dto.BookingDTO;
import com.busreservation.entity.Booking;
import com.busreservation.entity.Seat;
import com.busreservation.entity.Trip;
import com.busreservation.entity.User;
import com.busreservation.repository.BookingRepository;
import com.busreservation.repository.SeatRepository;
import com.busreservation.repository.TripRepository;
import com.busreservation.repository.UserRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TripRepository tripRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public Booking holdSeats(BookingDTO dto) {
        Trip trip = tripRepository.findById(dto.getTripId())
            .orElseThrow(() -> new RuntimeException("Trip not found"));

        User user = userRepository.findById(dto.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));

        List<Seat> selectedSeats = seatRepository.findByTripId(trip.getId()).stream()
            .filter(seat -> dto.getSeatNumbers().contains(seat.getSeatNumber()))
            .collect(Collectors.toList());

        for (Seat seat : selectedSeats) {
            if (seat.isBooked()) {
                throw new RuntimeException("Seat " + seat.getSeatNumber() + " already booked");
            }
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setTrip(trip);
        booking.setBookingDate(LocalDateTime.now());
        booking.setStatus("HOLD");
        booking.setTotalAmount(trip.getFare() * selectedSeats.size());
        Booking savedBooking = bookingRepository.save(booking);

        for (Seat seat : selectedSeats) {
            seat.setBooked(true);
            seat.setBooking(savedBooking);
            seatRepository.save(seat);
        }

        return savedBooking;
    }

    public String cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getStatus().equals("CONFIRMED")) {
            throw new RuntimeException("Only confirmed bookings can be cancelled");
        }

        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);

        List<Seat> seats = seatRepository.findByTripId(booking.getTrip().getId()).stream()
            .filter(seat -> seat.getBooking() != null && seat.getBooking().getId().equals(bookingId))
            .collect(Collectors.toList());

        for (Seat seat : seats) {
            seat.setBooked(false);
            seat.setBooking(null);
            seatRepository.save(seat);
        }

        return "Booking cancelled and seats released";
    }
}
