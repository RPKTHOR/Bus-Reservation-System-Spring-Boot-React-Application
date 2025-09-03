import { useState, useEffect } from "react";
import api from "../../services/api";

function TripScheduler() {
  const [trip, setTrip] = useState({
    busId: "",
    routeId: "",
    departureTime: "",
    arrivalTime: "",
    fare: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [busesRes, routesRes, tripsRes] = await Promise.all([
        api.get("/buses"),
        api.get("/routes"),
        api.get("/trips").catch(() => ({ data: [] }))
      ]);
      
      setBuses(busesRes.data || []);
      setRoutes(routesRes.data || []);
      setTrips(tripsRes.data || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const scheduleTrip = async (e) => {
    e.preventDefault();
    
    if (!trip.busId || !trip.routeId || !trip.departureTime || !trip.fare) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const tripData = {
        busId: parseInt(trip.busId),
        routeId: parseInt(trip.routeId),
        departureTime: trip.departureTime,
        arrivalTime: trip.arrivalTime || trip.departureTime, // Use departure if arrival not set
        fare: parseFloat(trip.fare)
      };

      await api.post("/trips", tripData);
      alert("Trip scheduled successfully!");
      setTrip({ busId: "", routeId: "", departureTime: "", arrivalTime: "", fare: "" });
      loadData();
    } catch (error) {
      alert("Failed to schedule trip: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setTrip({ ...trip, [e.target.name]: e.target.value });
  };

  // Auto-calculate arrival time (add 4 hours to departure)
  const handleDepartureChange = (e) => {
    const departureTime = e.target.value;
    const arrivalTime = new Date(new Date(departureTime).getTime() + 4 * 60 * 60 * 1000)
      .toISOString().slice(0, 16);
    
    setTrip({ 
      ...trip, 
      departureTime: departureTime,
      arrivalTime: arrivalTime 
    });
  };

  return (
    <div className="container mt-4">
      <h3>Trip Scheduler</h3>
      
      {/* Quick Info */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5>{buses.length}</h5>
              <p className="text-muted">Available Buses</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5>{routes.length}</h5>
              <p className="text-muted">Available Routes</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5>{trips.length}</h5>
              <p className="text-muted">Scheduled Trips</p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Trip Form */}
      <div className="card mb-4">
        <div className="card-header">
          <h5>Schedule New Trip</h5>
        </div>
        <div className="card-body">
          <form onSubmit={scheduleTrip}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Select Bus</label>
                <select 
                  className="form-select"
                  name="busId"
                  value={trip.busId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Select Bus --</option>
                  {buses.map((bus) => (
                    <option key={bus.id} value={bus.id}>
                      {bus.busNumber} - {bus.busType} ({bus.totalSeats} seats) - {bus.operatorName}
                    </option>
                  ))}
                </select>
                {buses.length === 0 && (
                  <small className="text-muted">No buses available. <a href="/admin/buses">Create buses first</a></small>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Select Route</label>
                <select 
                  className="form-select"
                  name="routeId"
                  value={trip.routeId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Select Route --</option>
                  {routes.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.source} → {route.destination} ({route.distance}km, {route.duration})
                    </option>
                  ))}
                </select>
                {routes.length === 0 && (
                  <small className="text-muted">No routes available. <a href="/admin/routes">Create routes first</a></small>
                )}
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Departure Date & Time</label>
                <input 
                  type="datetime-local" 
                  className="form-control"
                  name="departureTime"
                  value={trip.departureTime}
                  onChange={handleDepartureChange}
                  min={new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Arrival Date & Time</label>
                <input 
                  type="datetime-local" 
                  className="form-control"
                  name="arrivalTime"
                  value={trip.arrivalTime}
                  onChange={handleInputChange}
                />
                <small className="text-muted">Auto-calculated (+4 hours)</small>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Fare per Seat (₹)</label>
                <input 
                  type="number" 
                  className="form-control"
                  name="fare"
                  placeholder="500"
                  min="50"
                  max="5000"
                  value={trip.fare}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Scheduling..." : "Schedule Trip"}
            </button>
          </form>
        </div>
      </div>

      {/* Scheduled Trips */}
      <div className="card">
        <div className="card-header">
          <h5>Scheduled Trips ({trips.length})</h5>
        </div>
        <div className="card-body">
          {trips.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Bus</th>
                    <th>Route</th>
                    <th>Departure</th>
                    <th>Fare</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((t) => (
                    <tr key={t.id}>
                      <td>{t.id}</td>
                      <td>{t.bus?.busNumber || 'Bus-' + t.busId}</td>
                      <td>{t.route?.source || 'Source'} → {t.route?.destination || 'Destination'}</td>
                      <td>{new Date(t.departureTime).toLocaleString()}</td>
                      <td>₹{t.fare}</td>
                      <td><span className="badge bg-success">Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-muted">
              <i className="fas fa-calendar-plus fa-3x mb-3"></i>
              <p>No trips scheduled yet</p>
              <p><small>Create buses and routes first, then schedule trips</small></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TripScheduler;