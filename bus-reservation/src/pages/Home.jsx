import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoutButton from '../components/LogoutButton';

const Home = () => {
  const { user, isAdmin, isCustomer } = useAuth();

  return (
    <div className="container-fluid px-0">
      {/* Hero Section */}
      <section className="bg-light -white py-5">
        <div className="container d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <div className="text-center text-lg-start mb-4 mb-lg-0">
            <h1 className="display-4 fw-bold">Bus Reservation System</h1>
            <p className="lead">Book your journey with ease, speed, and confidence</p>
            {!user && (
              <Link to="/register" className="btn btn-primary btn-lg mt-3">
                Get Started
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4 justify-content-center">
            {!user ? (
              <>
                <FeatureCard
                  icon="fas fa-search"
                  title="Search Trips"
                  text="Find buses for your route and preferred time"
                  link="/search"
                  btnClass="btn-outline-primary"
                />
                <FeatureCard
                  icon="fas fa-user-plus"
                  title="Register"
                  text="Create an account to book tickets"
                  link="/register"
                  btnClass="btn-outline-success"
                />
                <FeatureCard
                  icon="fas fa-sign-in-alt"
                  title="Login"
                  text="Already have an account? Login here"
                  link="/login"
                  btnClass="btn-outline-info"
                />
              </>
            ) : (
              <>
                {isAdmin() && (
                  <FeatureCard
                    icon="fas fa-cogs"
                    title="Admin Dashboard"
                    text="Manage buses, routes, and view reports"
                    link="/admin"
                    btnClass="btn-warning"
                  />
                )}
                {isCustomer() && (
                  <FeatureCard
                    icon="fas fa-user"
                    title="Customer Dashboard"
                    text="View your bookings and search for trips"
                    link="/customer"
                    btnClass="btn-primary"
                  />
                )}
                <FeatureCard
                  icon="fas fa-search"
                  title="Search Trips"
                  text="Find and book your next journey"
                  link="/search"
                  btnClass="btn-success"
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Logout */}
      {user && (
        <div className="text-center my-4">
          <LogoutButton />
        </div>
      )}

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-5">
        <small>&copy; 2025 Bus Reservation System. All rights reserved.</small>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, text, link, btnClass }) => (
  <div className="col-12 col-md-6 col-lg-4">
    <div className="card h-100 shadow-sm border-0 hover-card">
      <div className="card-body text-center">
        <i className={`${icon} fa-3x text-secondary mb-3`}></i>
        <h5 className="card-title fw-bold">{title}</h5>
        <p className="card-text">{text}</p>
        <Link to={link} className={`btn ${btnClass} mt-2`}>
          {title}
        </Link>
      </div>
    </div>
  </div>
);

export default Home;
