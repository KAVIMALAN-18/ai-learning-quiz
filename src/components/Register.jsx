import React, { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(name, email, mobile, password);
    navigate("/dashboard");
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 20 }}>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={name} required onChange={e => setName(e.target.value)} />
        <br /><br />

        <input type="email" placeholder="Email" value={email} required onChange={e => setEmail(e.target.value)} />
        <br /><br />

        <input placeholder="Mobile" value={mobile} required onChange={e => setMobile(e.target.value)} />
        <br /><br />

        <input type="password" placeholder="Password" value={password} required onChange={e => setPassword(e.target.value)} />
        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
