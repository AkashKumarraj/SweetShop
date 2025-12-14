import "./Dashboard.css";
import { useEffect, useState } from "react";
import api from "../api/api";

function Dashboard() {
  const [sweets, setSweets] = useState([]);

  const fetchSweets = async () => {
    const res = await api.get("/sweets");
    setSweets(res.data);
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const handlePurchase = async (id) => {
    try {
      await api.post(`/sweets/${id}/purchase`);
      fetchSweets(); // refresh list
    } catch (err) {
      alert("Out of stock");
    }
  };

  return (
    <div className="dashboard">
      <h2>Sweets Dashboard</h2>

      {sweets.map((sweet) => (
        <div className="sweet-card" key={sweet.id}>
          <p><b>Name:</b> {sweet.name}</p>
          <p><b>Category:</b> {sweet.category}</p>
          <p><b>Price:</b> ₹{sweet.price}</p>
          <p><b>Quantity:</b> {sweet.quantity}</p>

          <button
            onClick={() => handlePurchase(sweet.id)}
            disabled={sweet.quantity === 0}
          >
            Purchase
          </button>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
