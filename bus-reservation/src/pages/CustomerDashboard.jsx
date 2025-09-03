import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function CustomerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      // Try to get bookings from API (might not exist)
      // For now, get from localStorage
      const storedBookings = [];
      
      // Check for confirmed tickets
      const confirmedTicket = localStorage.getItem('confirmedTicket');
      if (confirmedTicket) {
        const ticket = JSON.parse(confirmedTicket);
        storedBookings.push({
          id: ticket.bookingId,
          status: 'CONFIRMED',
          tripInfo: ticket.trip,
          seatNumbers: ticket.seatNumbers,
          totalAmount: ticket.totalAmount,
          bookingDate: ticket.confirmedAt,
          ticketNumber: ticket.ticketNumber
        });
      }

      // Check for pending bookings
      const pendingBooking = localStorage.getItem('pendingBooking');
      if (pendingBooking) {
        const booking = JSON.parse(pendingBooking);
        storedBookings.push({
          id: booking.bookingId || 'PENDING',
          status: 'HOLD',
          tripInfo: booking.trip,
          seatNumbers: booking.seatNumbers,
          totalAmount: booking.totalAmount,
          bookingDate: new Date().toISOString()
        });
      }

      setBookings(storedBookings);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicket = (bookingId) => {
    navigate(`/ticket/${bookingId}`);
  };

  const handleContinuePayment = (bookingId) => {
    navigate(`/checkout/${bookingId}`);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2>Welcome, {user?.name || user?.email}!</h2>
          <p className="text-muted">Manage your bookings and search for new trips</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <i className="fas fa-search fa-2x text-primary mb-2"></i>
              <h5>Search Trips</h5>
              <Link to="/search" className="btn btn-primary">Search Now</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <i className="fas fa-ticket-alt fa-2x text-success mb-2"></i>
              <h5>My Bookings</h5>
              <p>{bookings.length} booking(s)</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <i className="fas fa-headset fa-2x text-info mb-2"></i>
              <h5>Support</h5>
              <p>1800-XXX-XXXX</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="row">
        <div className="col-12">
          <h4>My Bookings</h4>
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border" role="status"></div>
              <p>Loading your bookings...</p>
            </div>
          ) : bookings.length > 0 ? (
            <div className="row">
              {bookings.map((booking, index) => (
                <div key={index} className="col-md-6 mb-3">
                  <div className="card">
                    <div className="card-header d-flex justify-content-between">
                      <span>Booking #{booking.id}</span>
                      <span className={`badge ${booking.status === 'CONFIRMED' ? 'bg-success' : 'bg-warning'}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="card-body">
                      <h6>{booking.tripInfo?.route?.source || 'Unknown'} → {booking.tripInfo?.route?.destination || 'Unknown'}</h6>
                      <p className="text-muted small">
                        {booking.tripInfo?.bus?.busNumber || 'Bus Info'} | 
                        {booking.tripInfo?.bus?.busType || 'Type'}
                      </p>
                      <p><strong>Seats:</strong> {booking.seatNumbers?.join(', ') || 'N/A'}</p>
                      <p><strong>Amount:</strong> ₹{booking.totalAmount || 0}</p>
                      <p><strong>Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
                      
                      <div className="mt-2">
                        {booking.status === 'CONFIRMED' ? (
                          <button 
                            className="btn btn-success btn-sm"
                            onClick={() => handleViewTicket(booking.id)}
                          >
                            View Ticket
                          </button>
                        ) : (
                          <button 
                            className="btn btn-warning btn-sm"
                            onClick={() => handleContinuePayment(booking.id)}
                          >
                            Complete Payment
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <i className="fas fa-ticket-alt fa-3x text-muted mb-3"></i>
              <p className="text-muted">No bookings found</p>
              <Link to="/search" className="btn btn-primary">Book Your First Trip</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;