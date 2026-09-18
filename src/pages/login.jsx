import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/feed");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithRedirect(auth, googleProvider);
      navigate("/feed");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex min-vh-100">
      {/* Left: hero panel */}
      <div
        className="d-none d-lg-flex flex-column justify-content-between text-white p-5"
        style={{
          width: "45%",
          background: "linear-gradient(160deg, #2f6b3a 0%, #1f4d29 100%)",
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <span
            className="d-flex align-items-center justify-content-center rounded-circle bg-white"
            style={{ width: 46, height: 46, fontSize: "1.5rem" }}
          >
            🏕️
          </span>
          <span className="fw-bold" style={{ fontSize: "1.6rem" }}>
            WildCrew
          </span>
        </div>

        <div>
          <h1
            className="fw-bold mb-3"
            style={{ fontSize: "2.5rem", lineHeight: 1.2 }}
          >
            Find your next
            <br />
            adventure crew.
          </h1>
          <p className="fs-5 text-white-50 mb-0" style={{ maxWidth: "380px" }}>
            Create trips, join hikes, and connect with people who love the
            outdoors as much as you do.
          </p>
        </div>

        <p className="text-white-50 small mb-0">
          &copy; {new Date().getFullYear()} WildCrew
        </p>
      </div>

      {/* Right: form panel */}
      <div
        className="d-flex align-items-center justify-content-center flex-grow-1 bg-light"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-100 px-4" style={{ maxWidth: "400px" }}>
          {/* mobile-only logo */}
          <div className="d-flex d-lg-none align-items-center gap-2 justify-content-center mb-4">
            <span
              className="d-flex align-items-center justify-content-center rounded-circle bg-success text-white"
              style={{ width: 40, height: 40, fontSize: "1.3rem" }}
            ></span>
            <span
              className="fw-bold"
              style={{ color: "#2f6b3a", fontSize: "1.4rem" }}
            >
              WildCrew
            </span>
          </div>

          <h2 className="fw-bold mb-1">
            {isSignUp ? "Create an account" : "Welcome back"}
          </h2>
          <p className="text-muted mb-4">
            {isSignUp
              ? "Join the crew and start planning your next trip."
              : "Log in to see what's happening on the trail."}
          </p>

          <form onSubmit={handleEmailAuth}>
            <div className="mb-3">
              <label className="form-label fw-medium">Email</label>
              <input
                type="email"
                className="form-control form-control-lg rounded-3"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-medium">Password</label>
              <input
                type="password"
                className="form-control form-control-lg rounded-3"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-success btn-lg w-100 rounded-pill fw-medium"
              disabled={loading}
            >
              {loading ? "Please wait..." : isSignUp ? "Sign up" : "Log in"}
            </button>
          </form>

          <div className="d-flex align-items-center my-4">
            <hr className="flex-grow-1" />
            <span className="mx-3 text-muted small">OR</span>
            <hr className="flex-grow-1" />
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="btn btn-outline-secondary btn-lg w-100 rounded-pill d-flex align-items-center justify-content-center gap-2"
            disabled={loading}
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.1 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.4C29.6 35.4 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.6 5.1C9.5 39.6 16.2 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.7l6.6 5.4C41.6 36 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5z"
              />
            </svg>
            Continue with Google
          </button>

          {error && (
            <div
              className="alert alert-danger mt-3 py-2 small rounded-3"
              role="alert"
            >
              {error}
            </div>
          )}

          <p className="text-center text-muted mt-4 mb-0">
            {isSignUp ? "Already have an account?" : "New here?"}{" "}
            <span
              onClick={() => setIsSignUp(!isSignUp)}
              className="fw-medium"
              style={{ color: "#2f6b3a", cursor: "pointer" }}
            >
              {isSignUp ? "Log in" : "Sign up"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
