import React, { useState, useEffect } from 'react';
import api from '/src/services/api';


const BusManagement = () => {
  const [buses, setBuses] = useState([]);
  const [formData, setFormData] = useState({
    busNumber: '',
    busType: 'AC',
    totalSeats: 40,
    operatorName: ''
  });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadBuses();
  }, []);

  const loadBuses = async () => {
    try {
      const response = await api.get('/buses');
      setBuses(response.data);
    } catch (error) {
      console.error('Failed to load buses:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editing) {
        await api.put(`/buses/${editing}`, formData);
        alert('Bus updated successfully');
      } else {
        await api.post('/buses', formData);
        alert('Bus created successfully');
      }
      
      setFormData({
        busNumber: '',
        busType: 'AC',
        totalSeats: 40,
        operatorName: ''
      });
      setEditing(null);
      loadBuses();
    } catch (error) {
      alert('Operation failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bus) => {
    setFormData({
      busNumber: bus.busNumber,
      busType: bus.busType,
      totalSeats: bus.totalSeats,
      operatorName: bus.operatorName
    });
    setEditing(bus.id);
  };

  const handleCancelEdit = () => {
    setFormData({
      busNumber: '',
      busType: 'AC',
      totalSeats: 40,
      operatorName: ''
    });
    setEditing(null);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">
            <i className="fas fa-bus me-2"></i>
            Bus Management
          </h2>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                {editing ? 'Edit Bus' : 'Add New Bus'}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="busNumber" className="form-label">Bus Number</label>
                  <input
                    type="text"
                    className="form-control"
                    id="busNumber"
                    name="busNumber"
                    value={formData.busNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="busType" className="form-label">Bus Type</label>
                  <select
                    className="form-select"
                    id="busType"
                    name="busType"
                    value={formData.busType}
                    onChange={handleChange}
                  >
                    <option value="AC">AC</option>
                    <option value="Non-AC">Non-AC</option>
                    <option value="Sleeper">Sleeper</option>
                    <option value="Semi-Sleeper">Semi-Sleeper</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="totalSeats" className="form-label">Total Seats</label>
                  <input
                    type="number"
                    className="form-control"
                    id="totalSeats"
                    name="totalSeats"
                    value={formData.totalSeats}
                    onChange={handleChange}
                    min="10"
                    max="60"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="operatorName" className="form-label">Operator Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="operatorName"
                    name="operatorName"
                    value={formData.operatorName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        {editing ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <i className={`fas ${editing ? 'fa-save' : 'fa-plus'} me-2`}></i>
                        {editing ? 'Update Bus' : 'Create Bus'}
                      </>
                    )}
                  </button>
                  
                  {editing && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Registered Buses</h5>
            </div>
            <div className="card-body">
              {buses.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Bus Number</th>
                        <th>Type</th>
                        <th>Seats</th>
                        <th>Operator</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {buses.map((bus) => (
                        <tr key={bus.id}>
                          <td>
                            <i className="fas fa-bus me-2 text-primary"></i>
                            {bus.busNumber}
                          </td>
                          <td>
                            <span className={`badge ${
                              bus.busType === 'AC' ? 'bg-success' : 
                              bus.busType === 'Sleeper' ? 'bg-info' : 'bg-secondary'
                            }`}>
                              {bus.busType}
                            </span>
                          </td>
                          <td>{bus.totalSeats}</td>
                          <td>{bus.operatorName}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEdit(bus)}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-muted">
                  <i className="fas fa-bus fa-3x mb-3"></i>
                  <p>No buses registered yet. Add your first bus!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusManagement;