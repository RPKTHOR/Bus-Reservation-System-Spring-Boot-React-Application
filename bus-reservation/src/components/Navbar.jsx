import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin, isCustomer } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">
        {/* Brand */}
        <NavLink className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <i className="fas fa-bus me-2"></i>
          Bus Reservation
        </NavLink>

        {/* Toggler */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Left Links */}
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/search">Search Trips</NavLink>
            </li>

            {/* Admin Dropdown */}
            {isAdmin() && (
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown"
                >
                  Admin Panel
                </a>
                <ul className="dropdown-menu">
                  <li><NavLink className="dropdown-item" to="/admin">Dashboard</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/admin/buses">Manage Buses</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/admin/routes">Manage Routes</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/admin/trips">Schedule Trips</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/admin/reports">Reports</NavLink></li>
                </ul>
              </li>
            )}

            {/* Customer Dashboard */}
            {isCustomer() && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/customer">My Dashboard</NavLink>
              </li>
            )}
          </ul>

          {/* Right Side */}
          <ul className="navbar-nav ms-auto">
            {user ? (
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle d-flex align-items-center" 
                  href="" 
                  role="button" 
                  data-bs-toggle="dropdown"
                >
                  <i className="fas fa-user me-2"></i>
                  {user.name || user.email}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <span className="dropdown-item-text">
                      Logged in as: {isAdmin() ? 'Admin' : 'Customer'}
                    </span>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">Login</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">Register</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
