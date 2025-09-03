import React, { useState } from 'react';
import api from '../services/api';

const TestDataCreator = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState({
    buses: 0,
    routes: 0,
    trips: 0
  });

  const createTestData = async () => {
    setLoading(true);
    try {
      // Create test buses
      const buses = [
        { busNumber: "MH12-1001", busType: "AC", totalSeats: 40, operatorName: "Express Travels" },
        { busNumber: "KA05-2002", busType: "Sleeper", totalSeats: 35, operatorName: "Comfort Bus" },
        { busNumber: "DL01-3003", busType: "Non-AC", totalSeats: 50, operatorName: "City Transport" },
        { busNumber: "TN09-4004", busType: "AC", totalSeats: 45, operatorName: "South Express" }
      ];

      for (const bus of buses) {
        try {
          await api.post('/buses', bus);
          setCreated(prev => ({ ...prev, buses: prev.buses + 1 }));
        } catch (err) {
          console.log('Bus already exists or error:', err.message);
        }
      }

      // Create test routes
      const routes = [
        { source: "Mumbai", destination: "Pune", distance: 150, duration: "3h 30m" },
        { source: "Delhi", destination: "Agra", distance: 200, duration: "4h 00m" },
        { source: "Bangalore", destination: "Chennai", distance: 350, duration: "6h 30m" },
        { source: "Hyderabad", destination: "Vijayawada", distance: 275, duration: "5h 15m" },
        { source: "Mumbai", destination: "Goa", distance: 450, duration: "8h 00m" },
        { source: "Delhi", destination: "Jaipur", distance: 280, duration: "5h 30m" }
      ];

      for (const route of routes) {
        try {
          await api.post('/routes', route);
          setCreated(prev => ({ ...prev, routes: prev.routes + 1 }));
        } catch (err) {
          console.log('Route already exists or error:', err.message);
        }
      }

      // Create test trips
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const trips = [
        {
          busId: 1,
          routeId: 1,
          departureTime: new Date(tomorrow.setHours(8, 0, 0, 0)).toISOString(),
          arrivalTime: new Date(tomorrow.setHours(11, 30, 0, 0)).toISOString(),
          fare: 500
        },
        {
          busId: 2,
          routeId: 1,
          departureTime: new Date(tomorrow.setHours(14, 0, 0, 0)).toISOString(),
          arrivalTime: new Date(tomorrow.setHours(17, 30, 0, 0)).toISOString(),
          fare: 750
        },
        {
          busId: 3,
          routeId: 2,
          departureTime: new Date(tomorrow.setHours(9, 0, 0, 0)).toISOString(),
          arrivalTime: new Date(tomorrow.setHours(13, 0, 0, 0)).toISOString(),
          fare: 400
        },
        {
          busId: 4,
          routeId: 3,
          departureTime: new Date(tomorrow.setHours(22, 0, 0, 0)).toISOString(),
          arrivalTime: new Date(tomorrow.setHours(4, 30, 0, 0)).toISOString(),
          fare: 1200
        }
      ];

      for (const trip of trips) {
        try {
          await api.post('/trips', trip);
          setCreated(prev => ({ ...prev, trips: prev.trips + 1 }));
        } catch (err) {
          console.log('Trip creation error:', err.message);
        }
      }

      alert(`Test data created successfully!\nBuses: ${created.buses + buses.length}\nRoutes: ${created.routes + routes.length}\nTrips: ${created.trips + trips.length}`);
      
    } catch (error) {
      console.error('Error creating test data:', error);
      alert('Error creating some test data. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create Test Data</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>This will create sample buses, routes, and trips for testing.</p>
            
            <div className="test-data-preview">
              <h6>Will Create:</h6>
              <ul>
                <li><strong>4 Buses:</strong> Different types (AC, Non-AC, Sleeper)</li>
                <li><strong>6 Routes:</strong> Popular city pairs</li>
                <li><strong>4 Trips:</strong> Scheduled for tomorrow</li>
              </ul>
            </div>

            {loading && (
              <div className="progress mb-3">
                <div className="progress-bar progress-bar-striped progress-bar-animated" 
                     style={{width: `${((created.buses + created.routes + created.trips) / 14) * 100}%`}}>
                </div>
              </div>
            )}

            <div className="creation-status">
              <small>
                Created: {created.buses} buses, {created.routes} routes, {created.trips} trips
              </small>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={createTestData}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Creating...
                </>
              ) : (
                'Create Test Data'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDataCreator;