import { useState, useEffect } from "react";
import api from "../../services/api";

function RouteManagement() {
  const [routes, setRoutes] = useState([]);
  const [route, setRoute] = useState({
    source: "",
    destination: "",
    distance: "",
    duration: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      const res = await api.get("/routes");
      setRoutes(res.data || []);
    } catch (err) {
      console.error("Failed to load routes");
    }
  };

  const createRoute = async (e) => {
    e.preventDefault();
    if (!route.source || !route.destination) {
      alert('Please fill source and destination');
      return;
    }

    setLoading(true);
    try {
      const routeData = {
        source: route.source,
        destination: route.destination,
        distance: parseFloat(route.distance) || 100,
        duration: route.duration || "2h 30m"
      };
      
      await api.post("/routes", routeData);
      alert("Route created successfully!");
      setRoute({ source: "", destination: "", distance: "", duration: "" });
      loadRoutes();
    } catch (err) {
      alert("Failed to create route: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setRoute({ ...route, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-4">
      <h3>Route Management</h3>
      
      {/* Create Route Form */}
      <div className="card mb-4">
        <div className="card-header">
          <h5>Add New Route</h5>
        </div>
        <div className="card-body">
          <form onSubmit={createRoute}>
            <div className="row">
              <div className="col-md-3 mb-3">
                <label className="form-label">Source City</label>
                <input 
                  type="text"
                  className="form-control"
                  name="source"
                  placeholder="e.g., Mumbai"
                  value={route.source}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Destination City</label>
                <input 
                  type="text"
                  className="form-control"
                  name="destination"
                  placeholder="e.g., Pune"
                  value={route.destination}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Distance (km)</label>
                <input 
                  type="number"
                  className="form-control"
                  name="distance"
                  placeholder="150"
                  value={route.distance}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Duration</label>
                <input 
                  type="text"
                  className="form-control"
                  name="duration"
                  placeholder="3h 30m"
                  value={route.duration}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? "Creating..." : "Create Route"}
            </button>
          </form>
        </div>
      </div>

      {/* Routes List */}
      <div className="card">
        <div className="card-header">
          <h5>Created Routes ({routes.length})</h5>
        </div>
        <div className="card-body">
          {routes.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Source</th>
                    <th>Destination</th>
                    <th>Distance</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {routes.map((r) => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{r.source}</td>
                      <td>{r.destination}</td>
                      <td>{r.distance} km</td>
                      <td>{r.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">No routes created yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RouteManagement;