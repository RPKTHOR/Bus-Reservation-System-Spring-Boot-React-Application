import React, { useState } from 'react';
import { Link } from "react-router-dom";
import LogoutButton from "../../components/LogoutButton";
import TestDataCreator from "../../components/TestDataCreator";

const AdminDashboard = () => {
  const [showTestCreator, setShowTestCreator] = useState(false);

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h2>Admin Dashboard</h2>
          <p>Manage buses, routes, trips, and view reports.</p>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <i className="fas fa-bus fa-2x text-primary mb-2"></i>
              <h6>Bus Management</h6>
              <Link to="/admin/buses" className="btn btn-primary btn-sm">Manage</Link>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <i className="fas fa-route fa-2x text-success mb-2"></i>
              <h6>Route Management</h6>
              <Link to="/admin/routes" className="btn btn-success btn-sm">Manage</Link>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <i className="fas fa-calendar fa-2x text-warning mb-2"></i>
              <h6>Trip Scheduler</h6>
              <Link to="/admin/trips" className="btn btn-warning btn-sm">Schedule</Link>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <i className="fas fa-chart-bar fa-2x text-info mb-2"></i>
              <h6>Reports</h6>
              <Link to="/admin/reports" className="btn btn-info btn-sm">View</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Test Data Section */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-warning">
            <div className="card-header bg-warning text-dark">
              <h5><i className="fas fa-flask me-2"></i>Testing Tools</h5>
            </div>
            <div className="card-body">
              <p>Quick tools for testing the application:</p>
              <button 
                className="btn btn-outline-warning me-2" 
                onClick={() => setShowTestCreator(true)}
              >
                <i className="fas fa-plus me-2"></i>
                Create Test Data
              </button>
              <Link to="/search" className="btn btn-outline-primary">
                <i className="fas fa-search me-2"></i>
                Test Booking Flow
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <LogoutButton />
      </div>

      {/* Test Data Creator Modal */}
      {showTestCreator && (
        <TestDataCreator onClose={() => setShowTestCreator(false)} />
      )}
    </div>
  );
};

export default AdminDashboard;