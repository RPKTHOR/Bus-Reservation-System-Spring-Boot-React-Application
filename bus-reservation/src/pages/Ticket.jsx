import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Ticket() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadTicket = async () => {
      try {
        // First try to get confirmed ticket from localStorage
        const confirmedTicket = localStorage.getItem('confirmedTicket');
        if (confirmedTicket) {
          setTicket(JSON.parse(confirmedTicket));
        } else {
          // Try API call
          try {
            const response = await api.get(`/tickets/${ticketId}`);
            setTicket(response.data);
          } catch (apiError) {
            // If both fail, show error
            throw new Error("Ticket not found");
          }
        }
      } catch (error) {
        console.error("Failed to load ticket:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTicket();
  }, [ticketId]);

  const generatePDFContent = (ticket) => {
    return `
=====================================
        E-TICKET - BUS RESERVATION
=====================================

TICKET DETAILS:
Ticket Number: ${ticket.ticketNumber}
Booking ID: ${ticket.bookingId}
Status: ${ticket.status}
Payment Reference: ${ticket.paymentRef || 'N/A'}

PASSENGER INFORMATION:
Name: ${ticket.passengerName}
Email: ${ticket.passengerEmail}
Phone: ${ticket.passengerPhone}

JOURNEY DETAILS:
From: ${ticket.trip?.route?.source}
To: ${ticket.trip?.route?.destination}
Date: ${new Date(ticket.trip?.departureTime).toLocaleDateString()}
Departure Time: ${new Date(ticket.trip?.departureTime).toLocaleTimeString()}
Arrival Time: ${new Date(ticket.trip?.arrivalTime).toLocaleTimeString()}

BUS INFORMATION:
Bus Number: ${ticket.trip?.bus?.busNumber}
Bus Type: ${ticket.trip?.bus?.busType}
Operator: ${ticket.trip?.bus?.operatorName}

SEAT DETAILS:
Seat Numbers: ${ticket.seatNumbers?.join(', ')}
Total Seats: ${ticket.seatNumbers?.length}

PAYMENT INFORMATION:
Total Amount: ₹${ticket.totalAmount}
Payment Method: ${ticket.paymentMethod?.toUpperCase() || 'N/A'}
Booking Date: ${new Date(ticket.trip?.bookingDate || ticket.confirmedAt).toLocaleString()}

IMPORTANT INSTRUCTIONS:
- Please arrive at the boarding point 15 minutes before departure
- Carry a valid ID proof during travel
- This ticket is non-transferable
- Show this e-ticket to the conductor for verification

=====================================
Generated on: ${new Date().toLocaleString()}
Bus Reservation System
=====================================
    `;
  };

  const handleDownloadPDF = () => {
    const content = generatePDFContent(ticket);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BusTicket_${ticket.ticketNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const ticketHTML = document.getElementById('ticket-content').innerHTML;
    printWindow.document.write(`
      <html>
        <head>
          <title>Bus Ticket - ${ticket.ticketNumber}</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
            body { font-family: Arial, sans-serif; }
            .ticket-card { border: 2px solid #007bff; margin: 20px; }
            @media print { .no-print { display: none !important; } }
          </style>
        </head>
        <body>${ticketHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: `Bus Ticket - ${ticket.ticketNumber}`,
      text: `My bus ticket from ${ticket.trip?.route?.source} to ${ticket.trip?.route?.destination}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`
Bus Ticket: ${ticket.ticketNumber}
From: ${ticket.trip?.route?.source} to ${ticket.trip?.route?.destination}
Date: ${new Date(ticket.trip?.departureTime).toLocaleDateString()}
Seats: ${ticket.seatNumbers?.join(', ')}
      `);
      alert('Ticket details copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading your ticket...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container mt-4 text-center">
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Ticket not found or may have expired.
        </div>
        <div className="mt-3">
          <button className="btn btn-primary me-2" onClick={() => navigate('/customer')}>
            Go to Dashboard
          </button>
          <button className="btn btn-success" onClick={() => navigate('/search')}>
            Book New Trip
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-10">
          {/* Action Buttons */}
          <div className="action-buttons mb-3 d-flex justify-content-between no-print">
            <div>
              <button className="btn btn-outline-secondary me-2" onClick={() => navigate('/customer')}>
                <i className="fas fa-arrow-left me-2"></i>Back to Dashboard
              </button>
            </div>
            <div>
              <button className="btn btn-outline-info me-2" onClick={handleShare}>
                <i className="fas fa-share me-2"></i>Share
              </button>
              <button className="btn btn-outline-primary me-2" onClick={handlePrint}>
                <i className="fas fa-print me-2"></i>Print
              </button>
              <button className="btn btn-success" onClick={handleDownloadPDF}>
                <i className="fas fa-download me-2"></i>Download
              </button>
            </div>
          </div>

          {/* Ticket Card */}
          <div className="ticket-card card" id="ticket-content">
            <div className="card-header bg-primary text-white text-center py-3">
              <h2><i className="fas fa-ticket-alt me-2"></i>E-TICKET</h2>
              <p className="mb-0 fs-5">Digital Bus Ticket</p>
              <small>Ticket Number: <strong>{ticket.ticketNumber}</strong></small>
            </div>
            
            <div className="card-body p-4">
              {/* Status Banner */}
              <div className="text-center mb-4">
                <span className={`badge fs-6 px-4 py-2 ${ticket.status === 'CONFIRMED' ? 'bg-success' : 'bg-warning'}`}>
                  <i className={`fas ${ticket.status === 'CONFIRMED' ? 'fa-check-circle' : 'fa-clock'} me-2`}></i>
                  {ticket.status}
                </span>
              </div>

              <div className="row">
                {/* Left Section */}
                <div className="col-md-8">
                  {/* Passenger Info */}
                  <div className="passenger-section mb-4">
                    <h5 className="border-bottom pb-2 mb-3">
                      <i className="fas fa-user me-2 text-primary"></i>Passenger Information
                    </h5>
                    <div className="row">
                      <div className="col-md-6">
                        <p><strong>Name:</strong> {ticket.passengerName}</p>
                        <p><strong>Email:</strong> {ticket.passengerEmail}</p>
                      </div>
                      <div className="col-md-6">
                        <p><strong>Phone:</strong> {ticket.passengerPhone}</p>
                        <p><strong>Booking ID:</strong> {ticket.bookingId}</p>
                      </div>
                    </div>
                  </div>

                  {/* Journey Details */}
                  <div className="journey-section mb-4">
                    <h5 className="border-bottom pb-2 mb-3">
                      <i className="fas fa-route me-2 text-success"></i>Journey Details
                    </h5>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="journey-point p-3 bg-light rounded mb-2">
                          <h6 className="text-success mb-2">
                            <i className="fas fa-map-marker-alt me-2"></i>Departure
                          </h6>
                          <p className="fs-4 fw-bold mb-1">{ticket.trip?.route?.source}</p>
                          <p className="mb-0">
                            <strong>Date:</strong> {new Date(ticket.trip?.departureTime).toLocaleDateString()}
                          </p>
                          <p className="mb-0">
                            <strong>Time:</strong> {new Date(ticket.trip?.departureTime).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="journey-point p-3 bg-light rounded mb-2">
                          <h6 className="text-danger mb-2">
                            <i className="fas fa-map-marker-alt me-2"></i>Arrival
                          </h6>
                          <p className="fs-4 fw-bold mb-1">{ticket.trip?.route?.destination}</p>
                          <p className="mb-0">
                            <strong>Date:</strong> {new Date(ticket.trip?.arrivalTime).toLocaleDateString()}
                          </p>
                          <p className="mb-0">
                            <strong>Time:</strong> {new Date(ticket.trip?.arrivalTime).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bus & Seat Details */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="bus-section">
                        <h5 className="border-bottom pb-2 mb-3">
                          <i className="fas fa-bus me-2 text-info"></i>Bus Information
                        </h5>
                        <p><strong>Bus Number:</strong> {ticket.trip?.bus?.busNumber}</p>
                        <p><strong>Bus Type:</strong> {ticket.trip?.bus?.busType}</p>
                        <p><strong>Operator:</strong> {ticket.trip?.bus?.operatorName}</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="seat-section">
                        <h5 className="border-bottom pb-2 mb-3">
                          <i className="fas fa-couch me-2 text-warning"></i>Seat Details
                        </h5>
                        <p><strong>Seat Numbers:</strong></p>
                        <div className="seats-display mb-2">
                          {ticket.seatNumbers?.map(seat => (
                            <span key={seat} className="badge bg-primary me-1 mb-1 fs-6 px-3 py-2">
                              {seat}
                            </span>
                          ))}
                        </div>
                        <p><strong>Total Amount:</strong> <span className="text-success fw-bold fs-5">₹{ticket.totalAmount}</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="payment-section mb-4">
                    <h5 className="border-bottom pb-2 mb-3">
                      <i className="fas fa-credit-card me-2 text-primary"></i>Payment Details
                    </h5>
                    <div className="row">
                      <div className="col-md-6">
                        <p><strong>Payment Method:</strong> {ticket.paymentMethod?.toUpperCase() || 'Online'}</p>
                        <p><strong>Payment Reference:</strong> {ticket.paymentRef}</p>
                      </div>
                      <div className="col-md-6">
                        <p><strong>Booking Date:</strong> {new Date(ticket.confirmedAt || ticket.trip?.bookingDate).toLocaleString()}</p>
                        <p><strong>Amount Paid:</strong> <span className="text-success fw-bold">₹{ticket.totalAmount}</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section - QR Code */}
                <div className="col-md-4 text-center">
                  <div className="qr-section p-3 border rounded">
                    <h6 className="mb-3">Verification QR Code</h6>
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify({
                        ticketNumber: ticket.ticketNumber,
                        bookingId: ticket.bookingId,
                        passengerName: ticket.passengerName,
                        route: `${ticket.trip?.route?.source} to ${ticket.trip?.route?.destination}`,
                        seats: ticket.seatNumbers?.join(','),
                        date: ticket.trip?.departureTime
                      }))}`}
                      alt="QR Code" 
                      className="img-fluid mb-2"
                      style={{ maxWidth: '200px' }}
                    />
                    <p className="text-muted small">Scan for verification</p>
                  </div>

                  {/* Quick Details */}
                  <div className="quick-details mt-3 p-3 bg-light rounded">
                    <h6>Quick Details</h6>
                    <p className="small mb-1"><strong>PNR:</strong> {ticket.ticketNumber.split('-')[1]}</p>
                    <p className="small mb-1"><strong>Seats:</strong> {ticket.seatNumbers?.length} seat(s)</p>
                    <p className="small mb-0"><strong>Status:</strong> <span className="text-success">Confirmed</span></p>
                  </div>
                </div>
              </div>

              {/* Important Instructions */}
              <div className="instructions-section mt-4 p-3 bg-warning bg-opacity-10 rounded">
                <h6><i className="fas fa-info-circle me-2 text-warning"></i>Important Instructions</h6>
                <div className="row">
                  <div className="col-md-6">
                    <ul className="small mb-0">
                      <li>Arrive 15 minutes before departure</li>
                      <li>Carry valid ID proof during travel</li>
                      <li>This ticket is non-transferable</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="small mb-0">
                      <li>Show e-ticket or QR to conductor</li>
                      <li>Keep this ticket until journey ends</li>
                      <li>Contact support for any issues</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="card-footer text-center bg-light py-3">
              <div className="row">
                <div className="col-md-6">
                  <small className="text-muted">
                    Generated on: {new Date().toLocaleString()}
                  </small>
                </div>
                <div className="col-md-6">
                  <small className="text-muted">
                    <strong>Bus Reservation System</strong> | Support: 1800-XXX-XXXX
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Bottom */}
          <div className="text-center mt-4 no-print">
            <button className="btn btn-outline-secondary me-2" onClick={() => navigate('/customer')}>
              <i className="fas fa-tachometer-alt me-2"></i>Dashboard
            </button>
            <button className="btn btn-primary me-2" onClick={() => navigate('/search')}>
              <i className="fas fa-search me-2"></i>Book Another Trip
            </button>
            <button className="btn btn-success" onClick={handleDownloadPDF}>
              <i className="fas fa-download me-2"></i>Save Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ticket;