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
      <h2>Admin Panel</h2>

      <h3>Add New Sweet</h3>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
      <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />
      <input name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} />
      <button onClick={addSweet}>Add Sweet</button>

      <hr />

      <h3>Manage Sweets</h3>
      {sweets.map((s) => (
        <div key={s.id}>
          {s.name} — Qty: {s.quantity}
          <button onClick={() => restock(s.id)}>Restock</button>
          <button onClick={() => deactivate(s.id)}>Deactivate</button>
          <button onClick={() => activate(s.id)}>Activate</button>
        </div>
      ))}
    </div>
  );
}

export default Admin;
