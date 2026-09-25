import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function CreateEvent() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    location: "",
    date: "",
    difficulty: "easy",
    maxHeadcount: 5,
    description: "",
    activityType: "hiking",
  });

  const [file, setFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]); // Array of raw File objects
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (new Date(form.date) < new Date().setHours(0, 0, 0, 0)) {
      setError("Event date cannot be in the past.");
      return;
    }

    setLoading(true);

    try {
      // 1. Upload Cover Image
      let imageUrl = "";
      if (file) {
        const imageRef = ref(storage, `eventImages/${Date.now()}_${file.name}`);
        await uploadBytes(imageRef, file);
        imageUrl = await getDownloadURL(imageRef);
      }

      // 2. Upload Gallery Images
      let galleryUrls = [];
      if (galleryFiles.length > 0) {
        galleryUrls = await Promise.all(
          galleryFiles.map(async (img) => {
            const imgRef = ref(
              storage,
              `eventGallery/${Date.now()}_${img.name}`,
            );
            await uploadBytes(imgRef, img);
            return await getDownloadURL(imgRef);
          }),
        );
      }

      // 3. Save Document with returned URLs
      await addDoc(collection(db, "events"), {
        ...form,
        maxHeadcount: Number(form.maxHeadcount),
        currentHeadcount: 0,
        coverImage: imageUrl,
        gallery: galleryUrls, // Directly assign uploaded URL array
        organizerId: user.uid,
        organizerName: user.displayName || user.email,
        createdAt: serverTimestamp(),
      });

      navigate("/feed");
    } catch (err) {
      setError(err.message || "Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="text-center py-5">Loading...</div>;

  if (!user) {
    return (
      <div className="text-center py-5">
        <h4>Please log in to create an event.</h4>
        <button
          className="btn btn-success mt-2"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4">Create Event</h2>

      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <div>
          <label className="form-label">Title</label>
          <input
            name="title"
            className="form-control"
            placeholder="Sunrise Hike"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="form-label">Location</label>
          <input
            name="location"
            className="form-control"
            placeholder="Blue Mountain Trailhead"
            onChange={handleChange}
            required
          />
        </div>

        <div className="row g-2">
          <div className="col">
            <label className="form-label">Date</label>
            <input
              name="date"
              type="date"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <label className="form-label">Max Attendees</label>
            <input
              name="maxHeadcount"
              type="number"
              min="1"
              value={form.maxHeadcount}
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row g-2">
          <div className="col">
            <label className="form-label">Activity</label>
            <select
              name="activityType"
              value={form.activityType}
              className="form-select"
              onChange={handleChange}
            >
              <option value="hiking">Hiking</option>
              <option value="running">Running</option>
              <option value="cycling">Cycling</option>
              <option value="swimming">Swimming</option>
            </select>
          </div>
          <div className="col">
            <label className="form-label">Difficulty</label>
            <select
              name="difficulty"
              value={form.difficulty}
              className="form-select"
              onChange={handleChange}
            >
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div>
          <label className="form-label">Description</label>
          <textarea
            name="description"
            rows={3}
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="form-label">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>

        <div>
          <label className="form-label">Additional Images</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            multiple
            onChange={(e) => setGalleryFiles(Array.from(e.target.files))}
          />
        </div>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
