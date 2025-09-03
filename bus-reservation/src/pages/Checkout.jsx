import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTimer } from "../hooks/useTimer";

function Checkout() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const { user } = useAuth();
  const navigate = useNavigate();

  const { timeLeft, formattedTime, startTimer, isExpired } = useTimer(
    600, // 10 minutes
    () => {
      alert("Payment timeout! Your seats have been released.");
      localStorage.removeItem('pendingBooking');
      navigate('/search');
    }
  );

  useEffect(() => {
    const loadBooking = async () => {
      try {
        // Get booking data from localStorage first
        const pendingBooking = localStorage.getItem('pendingBooking');
        const selectedTrip = localStorage.getItem('selectedTrip');
        
        let bookingData = null;
        
        if (pendingBooking) {
          bookingData = JSON.parse(pendingBooking);
        } else if (selectedTrip) {
          // Fallback to selected trip data
          const trip = JSON.parse(selectedTrip);
          bookingData = {
            trip: trip,
            seatNumbers: ['A1'], // Default if missing
            totalAmount: trip.fare || 500,
            seatCount: 1
          };
        }

        if (bookingData) {
          // Ensure all required data is present
          const completeBooking = {
            id: bookingId,
            status: 'HOLD',
            bookingDate: new Date().toISOString(),
            userId: user?.id || 1,
            passengerName: user?.name || user?.email || 'Customer',
            passengerEmail: user?.email || 'customer@example.com',
            passengerPhone: user?.phone || 'N/A',
            totalAmount: bookingData.totalAmount || 500,
            seatNumbers: bookingData.seatNumbers || ['A1'],
            seatCount: bookingData.seatCount || 1,
            farePerSeat: bookingData.farePerSeat || bookingData.totalAmount || 500,
            trip: {
              id: bookingData.trip?.id || bookingData.tripId,
              fare: bookingData.trip?.fare || bookingData.farePerSeat || 500,
              departureTime: bookingData.trip?.departureTime || new Date(Date.now() + 24*60*60*1000).toISOString(),
              arrivalTime: bookingData.trip?.arrivalTime || new Date(Date.now() + 27*60*60*1000).toISOString(),
              bus: {
                busNumber: bookingData.trip?.bus?.busNumber || 'BUS-001',
                busType: bookingData.trip?.bus?.busType || 'AC',
                operatorName: bookingData.trip?.bus?.operatorName || 'Express Travels',
                totalSeats: bookingData.trip?.bus?.totalSeats || 40
              },
              route: {
                source: bookingData.trip?.route?.source || 'Mumbai',
                destination: bookingData.trip?.route?.destination || 'Pune',
                distance: bookingData.trip?.route?.distance || 150,
                duration: bookingData.trip?.route?.duration || '3h 30m'
              }
            }
          };

          setBooking(completeBooking);
          startTimer();
        } else {
          throw new Error("No booking data found");
        }
      } catch (error) {
        console.error("Failed to load booking:", error);
        alert("Booking session expired. Please select seats again.");
        navigate('/search');
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [bookingId, user, navigate, startTimer]);

  const handlePayment = async () => {
    if (isExpired) {
      alert("Payment timeout! Please book again.");
      return;
    }

    setPaymentLoading(true);
    
    try {
      const paymentData = {
        bookingId: parseInt(bookingId),
        gatewayRef: "PAY_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
        status: "SUCCESS"
      };
      
      await api.post("/payments/checkout", paymentData);
      
      // Store complete ticket data
      const ticketData = {
        ticketNumber: `TKT-${bookingId}-${Date.now()}`,
        bookingId: bookingId,
        ...booking,
        paymentRef: paymentData.gatewayRef,
        paymentMethod: paymentMethod,
        confirmedAt: new Date().toISOString(),
        status: 'CONFIRMED'
      };
      
      localStorage.setItem('confirmedTicket', JSON.stringify(ticketData));
      localStorage.removeItem('pendingBooking');
      localStorage.removeItem('selectedTrip');
      
      setPaymentSuccess(true);
      
      setTimeout(() => {
        navigate(`/ticket/${bookingId}`);
      }, 3000);
      
    } catch (err) {
      console.error("Payment failed:", err);
      alert("Payment failed: " + (err.response?.data?.message || err.message));
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status"></div>
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body text-center">
                <i className="fas fa-check-circle fa-4x text-success mb-3"></i>
                <h3 className="text-success">Payment Successful!</h3>
                <p className="text-muted">Your booking has been confirmed.</p>
                <div className="booking-confirmed-info mt-3">
                  <p><strong>Booking ID:</strong> {bookingId}</p>
                  <p><strong>Amount Paid:</strong> ₹{booking?.totalAmount}</p>
                  <p><strong>Seats:</strong> {booking?.seatNumbers?.join(', ')}</p>
                  <p className="text-muted">Redirecting to your ticket...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Payment Timer */}
      <div className={`alert ${timeLeft < 120 ? 'alert-danger' : 'alert-warning'} text-center`}>
        <i className="fas fa-clock me-2"></i>
        <strong>Complete payment within: {formattedTime}</strong>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h4><i className="fas fa-credit-card me-2"></i>Complete Your Payment</h4>
            </div>
            <div className="card-body">
              {booking ? (
                <div className="row">
                  {/* Booking Details */}
                  <div className="col-md-6">
                    <h5>Passenger Details</h5>
                    <div className="mb-3">
                      <p><strong>Name:</strong> {booking.passengerName}</p>
                      <p><strong>Email:</strong> {booking.passengerEmail}</p>
                      <p><strong>Phone:</strong> {booking.passengerPhone}</p>
                      <p><strong>Booking ID:</strong> {booking.id}</p>
                    </div>

                    <h5>Journey Details</h5>
                    <div className="mb-3">
                      <p><strong>From:</strong> {booking.trip?.route?.source}</p>
                      <p><strong>To:</strong> {booking.trip?.route?.destination}</p>
                      <p><strong>Date:</strong> {new Date(booking.trip?.departureTime).toLocaleDateString()}</p>
                      <p><strong>Departure:</strong> {new Date(booking.trip?.departureTime).toLocaleTimeString()}</p>
                      <p><strong>Arrival:</strong> {new Date(booking.trip?.arrivalTime).toLocaleTimeString()}</p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <h5>Bus Details</h5>
                    <div className="mb-3">
                      <p><strong>Bus:</strong> {booking.trip?.bus?.busNumber}</p>
                      <p><strong>Type:</strong> {booking.trip?.bus?.busType}</p>
                      <p><strong>Operator:</strong> {booking.trip?.bus?.operatorName}</p>
                    </div>

                    <h5>Seat & Fare Details</h5>
                    <div className="mb-3">
                      <p><strong>Seats:</strong> 
                        <span className="ms-2">
                          {booking.seatNumbers?.map(seat => (
                            <span key={seat} className="badge bg-primary me-1">{seat}</span>
                          ))}
                        </span>
                      </p>
                      <p><strong>Fare per seat:</strong> ₹{booking.farePerSeat}</p>
                      <p><strong>Total seats:</strong> {booking.seatCount}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-danger">
                  <p>Booking details not available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Payment Summary</h5>
            </div>
            <div className="card-body">
              {booking && (
                <>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Base Fare ({booking.seatCount} seats)</span>
                      <span>₹{booking.totalAmount}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Taxes & Fees</span>
                      <span>₹0</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Total Amount</span>
                      <span className="text-success">₹{booking.totalAmount}</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h6>Payment Method</h6>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="paymentMethod" 
                        id="upi" 
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor="upi">
                        UPI Payment
                      </label>
                    </div>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="paymentMethod" 
                        id="card" 
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor="card">
                        Credit/Debit Card
                      </label>
                    </div>
                  </div>

                  <button 
                    className="btn btn-success w-100"
                    onClick={handlePayment}
                    disabled={paymentLoading || isExpired}
                  >
                    {paymentLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-lock me-2"></i>
                        Pay ₹{booking.totalAmount}
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;