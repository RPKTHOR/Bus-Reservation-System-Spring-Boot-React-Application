import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { getUserId } from "../utils/auth";
import { useTimer } from "../hooks/useTimer";

function SeatSelection() {
  const { tripId } = useParams();
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [holdingSeats, setHoldingSeats] = useState(false);
  const navigate = useNavigate();

  // 10-minute timer for seat selection
  const { timeLeft, formattedTime, isActive, startTimer, stopTimer, isExpired } = useTimer(
    600, // 10 minutes in seconds
    () => {
      alert("Time expired! Please select seats again.");
      setSelected([]);
      navigate(`/seats/${tripId}`);
    }
  );

  useEffect(() => {
    const loadTripData = async () => {
      try {
        const [tripRes, seatsRes] = await Promise.all([
          api.get(`/trips/${tripId}`),
          api.get(`/trips/${tripId}/seats`)
        ]);
        
        setTrip(tripRes.data);
        setSeats(seatsRes.data);
      } catch (error) {
        console.error("Failed to load trip data:", error);
        alert("Failed to load trip details");
        navigate('/search');
      } finally {
        setLoading(false);
      }
    };

    loadTripData();
  }, [tripId, navigate]);

  // Start timer when user first selects a seat
  useEffect(() => {
    if (selected.length > 0 && !isActive) {
      startTimer();
    } else if (selected.length === 0 && isActive) {
      stopTimer();
    }
  }, [selected.length, isActive, startTimer, stopTimer]);

  const toggleSeat = (seatNumber) => {
    if (isExpired) {
      alert("Session expired! Please refresh and select seats again.");
      return;
    }

    setSelected((prev) =>
      prev.includes(seatNumber) 
        ? prev.filter((s) => s !== seatNumber) 
        : [...prev, seatNumber]
    );
  };
  

// Add this to the holdSeats function - store complete trip data
const holdSeats = async () => {
  if (selected.length === 0) {
    alert("Please select at least one seat");
    return;
  }

  setHoldingSeats(true);
  try {
    const userId = getUserId() || 1;
    const farePerSeat = trip?.fare || 500;
    const totalAmount = farePerSeat * selected.length;
    
    // Store comprehensive booking data with proper nesting
    const bookingData = {
      userId: userId,
      tripId: parseInt(tripId),
      seatNumbers: selected,
      seatCount: selected.length,
      farePerSeat: farePerSeat,
      totalAmount: totalAmount,
      trip: {
        id: trip.id,
        fare: farePerSeat,
        departureTime: trip.departureTime,
        arrivalTime: trip.arrivalTime,
        bus: {
          busNumber: trip.bus?.busNumber || trip.busNumber || 'BUS-001',
          busType: trip.bus?.busType || trip.busType || 'AC',
          operatorName: trip.bus?.operatorName || trip.operatorName || 'Express Travels',
          totalSeats: trip.bus?.totalSeats || trip.totalSeats || 40
        },
        route: {
          source: trip.route?.source || trip.source || 'Mumbai',
          destination: trip.route?.destination || trip.destination || 'Pune',
          distance: trip.route?.distance || trip.distance || 150,
          duration: trip.route?.duration || trip.duration || '3h 30m'
        }
      }
    };
    
    localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
    
    const res = await api.post("/bookings/hold", {
      userId: userId,
      tripId: parseInt(tripId),
      seatNumbers: selected
    });
    
    stopTimer();
    navigate(`/checkout/${res.data.id}`);
  } catch (err) {
    console.error('Hold seats error:', err);
    alert("Failed to hold seats: " + (err.response?.data?.message || err.message));
  } finally {
    setHoldingSeats(false);
  }
};

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading trip details...</p>
      </div>
    );
  }

  const fareAmount = trip?.fare ? Number(trip.fare) : 0;
  const totalAmount = fareAmount * selected.length;

  return (
    <div className="container mt-4">
      {/* Timer Alert */}
      {isActive && (
        <div className={`alert ${timeLeft < 120 ? 'alert-danger' : 'alert-warning'} text-center`}>
          <i className="fas fa-clock me-2"></i>
          <strong>Time Remaining: {formattedTime}</strong>
          {timeLeft < 120 && <span className="ms-2">⚠️ Hurry up Before Someone gets your Seat!</span>}
        </div>
      )}

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h3>Select Your Seats</h3>
              {isActive && (
                <span className={`badge ${timeLeft < 120 ? 'bg-danger' : 'bg-warning'} fs-6`}>
                  {formattedTime}
                </span>
              )}
            </div>
            <div className="card-body">
              {/* Trip Info */}
              {trip && (
                <div className="trip-info mb-4 p-3 bg-light rounded">
                  <div className="row">
                    <div className="col-md-6">
                      <h5><i className="fas fa-bus me-2"></i>{trip.bus?.busNumber}</h5>
                      <p><strong>Route:</strong> {trip.route?.source} → {trip.route?.destination}</p>
                      <p><strong>Bus Type:</strong> {trip.bus?.busType}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Departure:</strong> {new Date(trip.departureTime).toLocaleString()}</p>
                      <p><strong>Arrival:</strong> {new Date(trip.arrivalTime).toLocaleString()}</p>
                      <p><strong>Fare:</strong> <span className="text-success fw-bold">₹{fareAmount} per seat</span></p>
                    </div>
                  </div>
                </div>
              )}

              {/* Seat Legend */}
              <div className="seat-legend mb-3">
                <span className="badge bg-success me-2">Available</span>
                <span className="badge bg-warning me-2">Selected</span>
                <span className="badge bg-secondary me-2">Booked</span>
              </div>

              {/* Seat Layout */}
              <div className="seat-layout">
                <div className="text-center mb-3">
                  <div className="bg-dark text-white rounded p-2 d-inline-block">
                    <i className="fas fa-steering-wheel me-2"></i>Driver
                  </div>
                </div>
                
                <div className="seats-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '10px',
                  maxWidth: '400px',
                  margin: '0 auto'
                }}>
                  {seats.map((seat) => (
                    <button
                      key={seat.seatNumber}
                      disabled={seat.booked || isExpired}
                      className={`btn seat-btn ${
                        seat.booked 
                          ? "btn-secondary" 
                          : selected.includes(seat.seatNumber) 
                          ? "btn-warning" 
                          : "btn-outline-success"
                      }`}
                      onClick={() => !seat.booked && toggleSeat(seat.seatNumber)}
                      style={{ aspectRatio: '1', fontSize: '0.8rem' }}
                    >
                      <i className="fas fa-chair mb-1"></i><br/>
                      {seat.seatNumber}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        

        {/* Booking Summary */}
        <div className="col-md-4">
          <div className="card sticky-top" style={{ top: '100px' }}>
            <div className="card-header">
              <h5><i className="fas fa-receipt me-2"></i>Booking Summary</h5>
            </div>
            <div className="card-body">
              {selected.length > 0 ? (
                <>
                  <div className="mb-3">
                    <h6>Selected Seats:</h6>
                    <div className="selected-seats">
                      {selected.map(seat => (
                        <span key={seat} className="badge bg-primary me-1 mb-1">
                          {seat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="fare-breakdown">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Base Fare ({selected.length} seat{selected.length > 1 ? 's' : ''})</span>
                      <span>₹{totalAmount}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Service Fee</span>
                      <span>₹0</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Total Amount</span>
                      <span className="text-success">₹{totalAmount}</span>
                    </div>
                  </div>

                  <button
                    className="btn btn-success w-100 mt-3"
                    onClick={holdSeats}
                    disabled={holdingSeats || isExpired}
                  >
                    {holdingSeats ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Holding Seats...
                      </>
                    ) : isExpired ? (
                      "Session Expired"
                    ) : (
                      <>
                        <i className="fas fa-arrow-right me-2"></i>
                        Proceed to Checkout
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="text-center text-muted">
                  <i className="fas fa-hand-pointer fa-2x mb-2"></i>
                  <p>Select seats to continue</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeatSelection;