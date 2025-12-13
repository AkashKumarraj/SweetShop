import React from 'react'

import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">
      <h2>Sweets Dashboard</h2>

      <div className="sweet-card">
        <p><b>Name:</b> Gulab Jamun</p>
        <p><b>Price:</b> ₹50</p>
        <button>Purchase</button>
      </div>
    </div>
  );
}

export default Dashboard;
