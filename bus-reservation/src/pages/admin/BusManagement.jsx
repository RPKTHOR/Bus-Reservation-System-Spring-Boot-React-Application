import { useState } from "react";
import api from "../../services/api";

function BusManagement() {
  const [bus, setBus] = useState({
    busNumber: "",
    busType: "AC",
    totalSeats: 40,
    operatorName: ""
  });

  const createBus = async () => {
    await api.post("/buses", bus);
    alert("Bus created successfully");
  };

  return (
    <div className="container mt-4">
      <h3>Create Bus</h3>
      <input placeholder="Bus Number" onChange={(e) => setBus({ ...bus, busNumber: e.target.value })} />
      <input placeholder="Operator Name" onChange={(e) => setBus({ ...bus, operatorName: e.target.value })} />
      <select onChange={(e) => setBus({ ...bus, busType: e.target.value })}>
        <option value="AC">AC</option>
        <option value="Non-AC">Non-AC</option>
        <option value="Sleeper">Sleeper</option>
      </select>
      <input type="number" placeholder="Total Seats" onChange={(e) => setBus({ ...bus, totalSeats: e.target.value })} />
      <button onClick={createBus}>Create Bus</button>
    </div>
  );
}

export default BusManagement;
