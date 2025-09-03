import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// Import all components
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import Home from "./pages/Home";
import SearchTrips from "./pages/SearchTrips";
import BusManagement from "./pages/BusManagement";
import RouteManagement from "./pages/admin/RouteManagement";
import TripScheduler from "./pages/admin/TripScheduler";
import Reports from "./pages/admin/Reports";
import SeatSelection from "./pages/SeatSelection";
import Ticket from "./pages/Ticket";
import Checkout from "./pages/Checkout";

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<SearchTrips />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/buses" element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <BusManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/routes" element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <RouteManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/trips" element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <TripScheduler />
              </ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <Reports />
              </ProtectedRoute>
            } />
            
            {/* Customer Routes */}
            <Route path="/customer" element={
              <ProtectedRoute requiredRole="ROLE_CUSTOMER">
                <CustomerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/seats/:tripId" element={
              <ProtectedRoute requiredRole="ROLE_CUSTOMER">
                <SeatSelection />
              </ProtectedRoute>
            } />
            <Route path="/checkout/:bookingId" element={
              <ProtectedRoute requiredRole="ROLE_CUSTOMER">
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/ticket/:ticketId" element={
              <ProtectedRoute requiredRole="ROLE_CUSTOMER">
                <Ticket />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;