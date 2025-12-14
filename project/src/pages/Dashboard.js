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
      <div className="dashboard-header">
        <h1>Sweets Dashboard</h1>
        <p>Browse and purchase your favorite sweets</p>
      </div>

      {sweets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🍬</div>
          <p>No sweets available at the moment</p>
        </div>
      ) : (
        <div className="sweets-grid">
          {sweets.map((sweet) => (
            <div className="sweet-card" key={sweet.id}>
              <div className="sweet-card-header">
                <h3>{sweet.name}</h3>
                <span className="sweet-category">{sweet.category}</span>
              </div>
              
              <div className="sweet-card-body">
                <div className="sweet-info">
                  <div className="info-item">
                    <span className="info-label">Price</span>
                    <span className="info-value">₹{sweet.price}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Stock</span>
                    <span className={`info-value ${sweet.quantity === 0 ? 'out-of-stock' : ''}`}>
                      {sweet.quantity === 0 ? 'Out of Stock' : `${sweet.quantity} available`}
                    </span>
                  </div>
                </div>
              </div>

              <button
                className="purchase-button"
                onClick={() => handlePurchase(sweet.id)}
                disabled={sweet.quantity === 0}
              >
                {sweet.quantity === 0 ? 'Out of Stock' : 'Purchase'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
