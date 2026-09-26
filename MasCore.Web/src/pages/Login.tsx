import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();

  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login({
        email,
        password,
      });

      navigate("/dashboard");
    } catch {
      setError(
        "Email or password is incorrect.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <form
        className="login-card glass-panel"
        onSubmit={handleSubmit}
      >
        <span className="section-eyebrow">
          ADMIN ACCESS
        </span>

        <h1>Welcome back.</h1>

        <p>
          Sign in to manage your projects and tasks.
        </p>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <label>
          Email

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="admin@example.com"
            required
          />
        </label>

        <label>
          Password

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="••••••••"
            required
          />
        </label>

        <button
          type="submit"
          className="hero-button login-submit"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}