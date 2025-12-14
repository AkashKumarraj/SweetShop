import "./Admin.css";
import { useEffect, useState } from "react";
import api from "../api/api";

function Admin() {
  const [sweets, setSweets] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });

  const fetchSweets = async () => {
    const res = await api.get("/sweets/all");
    setSweets(res.data);
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addSweet = async () => {
    await api.post("/sweets", {
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
    });
    setForm({ name: "", category: "", price: "", quantity: "" });
    fetchSweets();
  };

  const restock = async (id) => {
    await api.post(`/sweets/${id}/restock`);
    fetchSweets();
  };

  const deactivate = async (id) => {
    await api.post(`/sweets/${id}/deactivate`);
    fetchSweets();
  };

  const activate = async (id) => {
    await api.post(`/sweets/${id}/activate`);
    fetchSweets();
  };

  return (
    <div className="admin">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Panel</h1>
          <p>Manage your sweets inventory</p>
        </div>

        <div className="admin-section">
          <div className="section-card">
            <h2>Add New Sweet</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter sweet name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  placeholder="Enter category"
                  value={form.category}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="price">Price (₹)</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="Enter price"
                  value={form.price}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="quantity">Quantity</label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  value={form.quantity}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <button className="add-button" onClick={addSweet}>
              Add Sweet
            </button>
          </div>
        </div>

        <div className="admin-section">
          <div className="section-card">
            <h2>Manage Sweets</h2>
            {sweets.length === 0 ? (
              <div className="empty-state">
                <p>No sweets in inventory</p>
              </div>
            ) : (
              <div className="sweets-table">
                <div className="table-header">
                  <div className="table-cell">Name</div>
                  <div className="table-cell">Category</div>
                  <div className="table-cell">Price</div>
                  <div className="table-cell">Quantity</div>
                  <div className="table-cell">Status</div>
                  <div className="table-cell">Actions</div>
                </div>
                
                {sweets.map((s) => (
                  <div key={s.id} className="table-row">
                    <div className="table-cell">{s.name}</div>
                    <div className="table-cell">
                      <span className="category-badge">{s.category}</span>
                    </div>
                    <div className="table-cell">₹{s.price}</div>
                    <div className="table-cell">{s.quantity}</div>
                    <div className="table-cell">
                      <span className={`status-badge ${s.active !== false ? 'active' : 'inactive'}`}>
                        {s.active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="table-cell actions-cell">
                      <button
                        className="action-button restock-button"
                        onClick={() => restock(s.id)}
                      >
                        Restock
                      </button>
                      {s.active !== false ? (
                        <button
                          className="action-button deactivate-button"
                          onClick={() => deactivate(s.id)}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          className="action-button activate-button"
                          onClick={() => activate(s.id)}
                        >
                          Activate
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
