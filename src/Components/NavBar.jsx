import { Link, NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import defaultProfile from "../assets/profile-default.png";

const NAV_LINKS = [
  { to: "/feed", label: "Feed" },
  { to: "/create", label: "Create Event" },
  { to: "/dashboard", label: "Dashboard" },
];

function UserMenu({ user, onLogout }) {
  return (
    <li className="nav-item d-flex align-items-center gap-3 ms-lg-3">
      <div className="d-flex align-items-center gap-2 bg-light rounded-pill px-3 py-2">
        {user.photoURL ? (
          <img
            src={user.photoURL || defaultProfile}
            alt={user.displayName || user.email}
            className="rounded-circle"
            width={38}
            height={38}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div
            className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold"
            style={{ width: 38, height: 38, fontSize: "0.9rem" }}
          >
            {(user.displayName || user.email || "?").charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-dark fw-medium pe-1" style={{ fontSize: "1rem" }}>
          <Link to="/profile">{user.displayName || user.email}</Link>
        </span>
      </div>
      <button
        className="btn btn-outline-secondary rounded-pill px-4"
        style={{ fontSize: "1rem" }}
        onClick={onLogout}
      >
        Log out
      </button>
    </li>
  );
}

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-white sticky-top py-3"
      style={{ boxShadow: "0 1px 10px rgba(0,0,0,0.07)" }}
    >
      <div className="container">
        <Link
          className="navbar-brand fw-bold d-flex align-items-center gap-2"
          to={user ? "/feed" : "/login"}
        >
          <span style={{ color: "#2f6b3a", fontSize: "1.6rem" }}>WildCrew</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          {user && (
            <ul className="navbar-nav me-auto ms-lg-5 gap-lg-2">
              {NAV_LINKS.map(({ to, label }) => (
                <li className="nav-item" key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `nav-link px-3 py-2 rounded-pill ${
                        isActive
                          ? "text-success fw-semibold bg-success bg-opacity-10"
                          : "text-secondary"
                      }`
                    }
                    style={{ fontSize: "1.05rem" }}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}

          <ul className="navbar-nav ms-auto align-items-center">
            {user ? (
              <UserMenu user={user} onLogout={handleLogout} />
            ) : (
              <li className="nav-item">
                <Link
                  className="btn btn-success rounded-pill px-4 py-2"
                  style={{ fontSize: "1.05rem" }}
                  to="/login"
                >
                  Log in
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
