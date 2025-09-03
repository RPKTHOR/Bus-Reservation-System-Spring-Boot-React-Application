import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const SearchTrips = () => {
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    travelDate: ''
  });
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  
  const { isCustomer, user } = useAuth();
  const navigate = useNavigate();

  // Load all trips on mount for fallback
  useEffect(() => {
    loadAllTrips();
  }, []);

  const loadAllTrips = async () => {
    try {
      const response = await api.get('/trips');
      if (response.data) {
        const processedTrips = response.data.map(trip => ({
          id: trip.id,
          // Handle nested bus object
          busNumber: trip.bus?.busNumber || `BUS-${trip.id}`,
          busType: trip.bus?.busType || 'AC',
          operatorName: trip.bus?.operatorName || 'Express Travels',
          totalSeats: trip.bus?.totalSeats || 40,
          // Handle nested route object
          source: trip.route?.source || 'Mumbai',
          destination: trip.route?.destination || 'Pune',
          distance: trip.route?.distance || 150,
          duration: trip.route?.duration || '3h 30m',
          // Trip details
          departureTime: trip.departureTime || new Date(Date.now() + 24*60*60*1000).toISOString(),
          arrivalTime: trip.arrivalTime || new Date(Date.now() + 28*60*60*1000).toISOString(),
          fare: trip.fare || 500,
          availableSeats: trip.availableSeats || (trip.bus?.totalSeats ? trip.bus.totalSeats - 5 : 35),
          // Store original nested objects for later use
          bus: trip.bus,
          route: trip.route
        }));
        setTrips(processedTrips);
      }
    } catch (error) {
      console.error('Failed to load trips:', error);
      setTrips([]);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      const response = await api.get('/trips/search', {
        params: {
          source: formData.source,
          destination: formData.destination,
          date: formData.travelDate
        }
      });
      
      if (response.data && response.data.length > 0) {
        const processedTrips = response.data.map(trip => ({
          id: trip.id,
          busNumber: trip.bus?.busNumber || trip.busNumber || `BUS-${trip.id}`,
          busType: trip.bus?.busType || trip.busType || 'AC',
          operatorName: trip.bus?.operatorName || trip.operatorName || 'Express Travels',
          source: trip.route?.source || trip.source || formData.source,
          destination: trip.route?.destination || trip.destination || formData.destination,
          departureTime: trip.departureTime,
          arrivalTime: trip.arrivalTime,
          fare: trip.fare || 500,
          availableSeats: trip.availableSeats || 35,
          bus: trip.bus,
          route: trip.route
        }));
        setTrips(processedTrips);
      } else {
        setTrips([]);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const handleShowAllTrips = () => {
    setSearched(true);
    loadAllTrips();
  };

  const handleBookTrip = (trip) => {
    if (!user) {
      alert('Please login to book trips');
      navigate('/login');
      return;
    }
    if (!isCustomer()) {
      alert('Only customers can book trips');
      return;
    }
    
    // Store complete trip data
    localStorage.setItem('selectedTrip', JSON.stringify(trip));
    navigate(`/seats/${trip.id}`);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Search Bus Trips</h2>

      {/* Search Form */}
      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSearch}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">From</label>
                <input
                  type="text"
                  className="form-control"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  placeholder="Enter source city"
                  required
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">To</label>
                <input
                  type="text"
                  className="form-control"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="Enter destination city"
                  required
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Travel Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="travelDate"
                  value={formData.travelDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-primary me-2" disabled={loading}>
                {loading ? 'Searching...' : 'Search Trips'}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={handleShowAllTrips}>
                View All Trips
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Results */}
      {searched && (
        <>
          <h4>Available Trips ({trips.length})</h4>
          {trips.length === 0 ? (
            <div className="alert alert-info">
              <p>No trips found for your search.</p>
              <button className="btn btn-primary" onClick={handleShowAllTrips}>
                View All Available Trips
              </button>
            </div>
          ) : (
            <div className="row">
              {trips.map((trip) => (
                <div key={trip.id} className="col-md-6 mb-3">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-2">
                        <h5>{trip.busNumber}</h5>
                        <span className="badge bg-primary">{trip.busType}</span>
                      </div>
                      
                      <p className="text-muted">{trip.operatorName}</p>
                      
                      <div className="route-info mb-3">
                        <div className="d-flex justify-content-between">
                          <div>
                            <strong>{trip.source}</strong>
                            <br/>
                            <small>{new Date(trip.departureTime).toLocaleTimeString()}</small>
                          </div>
                          <div className="text-center">
                            <i className="fas fa-arrow-right"></i>
                            <br/>
                            <small>{trip.duration}</small>
                          </div>
                          <div className="text-end">
                            <strong>{trip.destination}</strong>
                            <br/>
                            <small>{new Date(trip.arrivalTime).toLocaleTimeString()}</small>
                          </div>
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h4 className="text-success mb-0">₹{trip.fare}</h4>
                          <small className="text-muted">{trip.availableSeats} seats left</small>
                        </div>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleBookTrip(trip)}
                          disabled={trip.availableSeats === 0}
                        >
                          {trip.availableSeats === 0 ? 'Sold Out' : 'Select Seats'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchTrips;