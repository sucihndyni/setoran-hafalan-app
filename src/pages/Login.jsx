import { useState } from "react";
import { login } from "../services/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.response || err);
      const errorData = err.response?.data;
      const message = errorData
        ? errorData.error_description || errorData.error || JSON.stringify(errorData)
        : err.message;
      alert(`Login gagal: ${message}`);
    }
  };

  return (
    <div className="login-bg">
      <div className="card login-card fade-in-up">
        <div className="card-body">
          <h3 className="text-center mb-3">Silahkan Login</h3>
          <p className="login-note">Masukkan username dan password Anda.</p>

          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              className="form-control input-theme"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control input-theme"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn btn-theme w-100" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
