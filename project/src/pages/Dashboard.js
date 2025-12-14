import "./Dashboard.css";
import { useEffect, useState } from "react";
import api from "../api/api";

function Dashboard() {
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const fetchSweets = async () => {
    const res = await api.get("/sweets");
    setSweets(res.data);
    setFilteredSweets(res.data);
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  useEffect(() => {
    let filtered = sweets;

    if (searchTerm) {
      filtered = filtered.filter((sweet) =>
        sweet.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((sweet) => sweet.category === selectedCategory);
    }

    setFilteredSweets(filtered);
  }, [searchTerm, selectedCategory, sweets]);

  const handlePurchase = async (id) => {
    try {
      await api.post(`/sweets/${id}/purchase`);
      fetchSweets(); // refresh list
    } catch (err) {
      alert("Out of stock");
    }
  };

  const categories = ["all", ...new Set(sweets.map((sweet) => sweet.category))];


  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Sweets Dashboard</h1>
        <p>Browse and purchase your favorite sweets</p>
        <div className="stats-bar">
          <span className="stat-item">
            <strong>{filteredSweets.length}</strong> {filteredSweets.length === 1 ? 'product' : 'products'}
          </span>
          <span className="stat-item">
            <strong>{sweets.filter(s => s.quantity > 0).length}</strong> in stock
          </span>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search sweets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredSweets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🍬</div>
          <p>No sweets found</p>
          {(searchTerm || selectedCategory !== "all") && (
            <button
              className="clear-filters-button"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="sweets-grid">
          {filteredSweets.map((sweet) => (
            <div className="sweet-card" key={sweet.id}>
              {sweet.image && (
                <div className="sweet-image-container">
                  <img
                    src={sweet.image}
                    alt={sweet.name}
                    className="sweet-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  {sweet.quantity === 0 && (
                    <div className="out-of-stock-overlay">Out of Stock</div>
                  )}
                </div>
              )}
              
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
