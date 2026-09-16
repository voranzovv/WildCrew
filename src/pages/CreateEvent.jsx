import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function CreateEvent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    location: "",
    lat: "",
    lng: "",
    date: "",
    difficulty: "easy",
    maxHeadcount: 5,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (new Date(form.date) < new Date().setHours(0, 0, 0, 0)) {
      setError("Event date can't be in the past.");
      return;
    }
    if (Number(form.maxHeadcount) < 1) {
      setError("Max headcount must be at least 1.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "events"), {
        ...form,
        lat: Number(form.lat),
        lng: Number(form.lng),
        maxHeadcount: Number(form.maxHeadcount),
        currentHeadcount: 0,
        likeCount: 0,
        organizerId: user.uid,
        organizerName: user.displayName || user.email,
        status: "open",
        createdAt: serverTimestamp(),
      });
      navigate("/feed");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4">Create an Event</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Event Title</label>
          <input
            name="title"
            className="form-control"
            placeholder="e.g. Sunrise hike at Blue Mountain"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Location Name</label>
          <input
            name="location"
            className="form-control"
            placeholder="e.g. Blue Mountain Trailhead"
            onChange={handleChange}
            required
          />
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Latitude</label>
            <input
              name="lat"
              type="number"
              step="any"
              className="form-control"
              placeholder="e.g. 43.6532"
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <label className="form-label">Longitude</label>
            <input
              name="lng"
              type="number"
              step="any"
              className="form-control"
              placeholder="e.g. -79.3832"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            name="date"
            type="date"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Difficulty</label>
          <select
            name="difficulty"
            className="form-select"
            onChange={handleChange}
          >
            <option value="easy">Easy</option>
            <option value="moderate">Moderate</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="form-label">Max Headcount</label>
          <input
            name="maxHeadcount"
            type="number"
            min="1"
            className="form-control"
            defaultValue={5}
            onChange={handleChange}
            required
          />
        </div>

        {error && (
          <div className="alert alert-danger py-2 small" role="alert">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
