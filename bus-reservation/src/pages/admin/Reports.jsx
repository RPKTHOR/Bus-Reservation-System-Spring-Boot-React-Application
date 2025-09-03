import { useEffect, useState } from "react";
import api from "../../services/api";

function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/reports/sales")
      .then((res) => setReport(res.data))
      .catch((err) => console.error("Failed to load reports:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status"></div>
          <p>Loading report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3>Sales Report</h3>
      {report ? (
        <div className="row">
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <h5>Total Revenue</h5>
                <h3 className="text-success">₹{report.totalRevenue}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <h5>Total Bookings</h5>
                <h3 className="text-info">{report.totalBookings}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <h5>Top Route</h5>
                <h6 className="text-primary">{report.topRoute}</h6>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning">No report data available</div>
      )}
    </div>
  );
}

export default Reports;