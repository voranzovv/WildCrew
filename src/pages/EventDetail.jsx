import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alreadyRequested, setAlreadyRequested] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const snap = await getDoc(doc(db, "events", id));
        if (snap.exists()) {
          setEvent({ id: snap.id, ...snap.data() });
        }
      } catch (err) {
        console.error("Error loading event:", err);
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [id]);

  useEffect(() => {
    const checkExistingRequest = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, "joinRequests"),
          where("eventId", "==", id),
          where("userId", "==", user.uid),
        );
        const snap = await getDocs(q);
        setAlreadyRequested(!snap.empty);
      } catch (err) {
        console.error("Error checking requests:", err);
      }
    };
    checkExistingRequest();
  }, [id, user]);

  const handleRequestToJoin = async () => {
    setRequesting(true);
    setMessage("");
    try {
      await addDoc(collection(db, "joinRequests"), {
        eventId: id,
        eventTitle: event.title,
        userId: user.uid,
        userName: user.displayName || user.email,
        organizerId: event.organizerId,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setAlreadyRequested(true);
      setMessage("Request sent! The organizer will review it soon.");
    } catch (err) {
      setMessage(
        "Something went wrong: " + (err.message || "Failed to send request."),
      );
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading event...</span>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container py-5 text-center">
        <h3 className="fw-bold">Event Not Found</h3>
        <p className="text-muted">
          The event you are looking for does not exist or has been removed.
        </p>
        <button
          className="btn btn-outline-primary mt-2"
          onClick={() => navigate("/feed")}
        >
          Return to Feed
        </button>
      </div>
    );
  }

  const isFull = event.currentHeadcount >= event.maxHeadcount;
  const isOrganizer = user?.uid === event.organizerId;

  // Difficulty badge colors
  const difficultyBadges = {
    easy: "bg-success-subtle text-success border-success-subtle",
    moderate: "bg-warning-subtle text-warning border-warning-subtle",
    hard: "bg-danger-subtle text-danger border-danger-subtle",
  };

  return (
    <div className="container py-4" style={{ maxWidth: "800px" }}>
      {/* Back Button */}
      <button
        className="btn btn-link link-secondary text-decoration-none ps-0 mb-3 fw-semibold"
        onClick={() => navigate("/feed")}
      >
        <i className="bi bi-arrow-left"></i> Back to Feed
      </button>

      {/* Main Card */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        {/* Hero Cover Image Header */}
        <div className="position-relative bg-dark" style={{ height: "320px" }}>
          {event.coverImage ? (
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-100 h-100 object-fit-cover opacity-90"
            />
          ) : (
            <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-secondary text-white">
              <span className="fs-1">cdjabficjb</span>
            </div>
          )}

          <div className="position-absolute top-0 start-0 m-3 d-flex gap-2">
            <span className="badge bg-dark bg-opacity-75 backdrop-blur px-3 py-2 rounded-pill text-capitalize fw-normal">
              {event.activityType || "Outdoor"}
            </span>
            <span
              className={`badge border px-3 py-2 rounded-pill text-capitalize fw-normal ${difficultyBadges[event.difficulty] || "bg-secondary text-white"}`}
            >
              {event.difficulty}
            </span>
          </div>
          <div className="position-absolute bottom-0 end-0 m-3 text-end">
            <h1 className="fw-bold h2 mb-1"> {event.title}</h1>
          </div>
        </div>

        {/* Event Body */}
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
            <div>
              <h1 className="fw-bold h2 mb-1">{event.title}</h1>
              <p className="text-secondary mb-0 fs-6">{event.location}</p>
            </div>

            <div className="text-end">
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 fs-6 rounded-pill">
                {event.currentHeadcount} / {event.maxHeadcount} Joined
              </span>
            </div>
          </div>

          <hr className="my-4 text-muted opacity-25" />

          <div className="row g-3 mb-4">
            <div className="col-sm-6">
              <div className="p-3 bg-light rounded-3 border border-light-subtle">
                <small className="text-muted d-block uppercase tracking-wider mb-1">
                  Date & Time
                </small>
                <span className="fw-semibold text-dark">{event.date}</span>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="p-3 bg-light rounded-3 border border-light-subtle">
                <small className="text-muted d-block uppercase tracking-wider mb-1">
                  Organizer
                </small>
                <span className="fw-semibold text-dark">
                  {event.organizerName || "WildCrew Member"}
                </span>
              </div>
            </div>
          </div>

          {/* About Section */}
          <h5 className="fw-bold mb-2">About this Activity</h5>
          <p
            className="text-secondary leading-relaxed mb-4"
            style={{ whiteSpace: "pre-line" }}
          >
            {event.description}
          </p>

          {/* Gallery Section */}
          {event.gallery && event.gallery.length > 0 && (
            <div className="mt-4">
              <h5 className="fw-bold mb-3">Event Gallery</h5>
              <div className="row g-3">
                {event.gallery.map((imgUrl, index) => (
                  <div className="col-6 col-md-4" key={index}>
                    <div
                      className="rounded-3 overflow-hidden border shadow-sm"
                      style={{ height: "140px" }}
                    >
                      <img
                        src={imgUrl}
                        alt={`Gallery ${index + 1}`}
                        className="w-100 h-100 object-fit-cover hover-zoom"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="card-footer bg-light p-4 border-top-0 rounded-bottom-4">
          {isOrganizer && (
            <div className="alert alert-info border-0 shadow-sm m-0">
              <strong>You are the organizer</strong> of this event. Manage
              incoming join requests from your dashboard.
            </div>
          )}

          {!isOrganizer && !alreadyRequested && !isFull && (
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div>
                <h6 className="mb-0 fw-semibold">
                  Ready to join this adventure?
                </h6>
                <small className="text-muted">
                  The organizer will review your request once submitted.
                </small>
              </div>
              <button
                className="btn btn-primary btn-lg px-4 rounded-pill fw-semibold shadow-sm"
                onClick={handleRequestToJoin}
                disabled={requesting}
              >
                {requesting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
                    Sending...
                  </>
                ) : (
                  "Request to Join"
                )}
              </button>
            </div>
          )}

          {!isOrganizer && alreadyRequested && (
            <div className="alert alert-secondary border-0 shadow-sm m-0">
              ⌛ You have already requested to join this event. Waiting for
              organizer approval.
            </div>
          )}

          {!isOrganizer && isFull && !alreadyRequested && (
            <div className="alert alert-warning border-0 shadow-sm m-0">
              This event is currently full ({event.maxHeadcount}/
              {event.maxHeadcount} spots filled).
            </div>
          )}

          {message && (
            <div className="alert alert-success border-0 shadow-sm mt-3 mb-0">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
