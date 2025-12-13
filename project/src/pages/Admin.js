import React from 'react'

import "./Admin.css";

function Admin() {
  return (
    <div className="admin">
      <h2>Admin Panel</h2>
      <input placeholder="Sweet Name" />
      <input placeholder="Price" />
      <button>Add Sweet</button>
    </div>
  );
}

export default Admin;
