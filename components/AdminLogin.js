"use client";

import { useState } from "react";
import { adminLogin } from "../app/actions";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const password = event.target.password.value;
    const result = await adminLogin(password);

    if (result.success) {
      // Reload page to re-render Server Component with authenticated state
      window.location.reload();
    } else {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="section" style={{ minHeight: "60vh", display: "flex", alignItems: "center" }}>
      <div className="container" style={{ maxWidth: "450px" }}>
        <div className="glass-panel" style={{ padding: "2.5rem", borderTop: "5px solid var(--color-primary)" }}>
          <h2 style={{ color: "var(--color-primary)", marginBottom: "0.5rem", fontSize: "1.75rem" }}>Admin Dashboard Login</h2>
          <p style={{ fontSize: "0.95rem", color: "var(--color-text-light)", marginBottom: "2rem" }}>
            Please enter the administrator password to manage site content.
          </p>
          
          {error && (
            <div className="status-banner status-error" style={{ fontSize: "0.9rem", padding: "0.75rem 1rem", marginBottom: "1.5rem" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                required 
                placeholder="Enter password" 
                className="form-input" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "1rem" }}
            >
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
