import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [clientId, setClientId] = useState("User");
  const [clientSecret, setClientSecret] = useState("User@123");
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.clear();
  });
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const credentials = btoa(`${clientId}:${clientSecret}`); // base64 encode

    try {
      const response = await axios.post(
        import.meta.env.VITE_AUTH_SERVER_URL,
        new URLSearchParams({
          grant_type: "client_credentials",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${credentials}`,
          },
        }
      );
      localStorage.setItem("Authorization", response.data.access_token);

      console.log(response.data);
      console.log("Access Token:", response.data.access_token);

      navigate("/landing");
    } catch (err) {
      setError("Invalid credentials or OAuth server error.");
    }
  };

  return (
    <div className="container mt-5">
      <form
        onSubmit={handleLogin}
        className="p-4 rounded"
        style={{ border: "1px solid red", maxWidth: "400px", margin: "0 auto" }}
      >
        <h3 className="text-center mb-3">Login</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="form-label">Client ID</label>
          <input
            type="text"
            className="form-control"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Client Secret</label>
          <input
            type="password"
            className="form-control"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            required
          />
        </div>

        <div className="d-grid">
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
