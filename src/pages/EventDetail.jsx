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
import TrailMap from "../Components/TrailMap";

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
      const snap = await getDoc(doc(db, "events", id));
      if (snap.exists()) {
        setEvent({ id: snap.id, ...snap.data() });
      }
      setLoading(false);
    };
    loadEvent();
  }, [id]);

  useEffect(() => {
    const checkExistingRequest = async () => {
      const q = query(
        collection(db, "joinRequests"),
        where("eventId", "==", id),
        where("userId", "==", user.uid),
      );
      const snap = await getDocs(q);
      setAlreadyRequested(!snap.empty);
    };
    if (user) checkExistingRequest();
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
      setMessage("Something went wrong: " + err.message);
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return <div className="container py-5">Loading...</div>;
  if (!event) return <div className="container py-5">Event not found.</div>;

  const isFull = event.currentHeadcount >= event.maxHeadcount;
  const isOrganizer = user.uid === event.organizerId;

  return (
    <div className="container py-5" style={{ maxWidth: "700px" }}>
      <button
        className="btn btn-link ps-0 mb-3"
        onClick={() => navigate("/feed")}
      >
        ← Back to Feed
      </button>

      <h2>{event.title}</h2>
      <p className="text-muted mb-1">{event.location}</p>
      <p className="mb-1">
        {event.date} &middot;{" "}
        <span className="text-capitalize">{event.difficulty}</span>
      </p>
      <p className="mb-3">
        <span className="badge bg-secondary">
          {event.currentHeadcount}/{event.maxHeadcount} joined
        </span>
      </p>

      {isOrganizer && (
        <div className="alert alert-info">
          You're the organizer of this event.
        </div>
      )}

      {!isOrganizer && !alreadyRequested && !isFull && (
        <button
          className="btn btn-primary"
          onClick={handleRequestToJoin}
          disabled={requesting}
        >
          {requesting ? "Sending..." : "Request to Join"}
        </button>
      )}

      {!isOrganizer && alreadyRequested && (
        <div className="alert alert-secondary">
          You've already requested to join — waiting for the organizer.
        </div>
      )}

      {!isOrganizer && isFull && !alreadyRequested && (
        <div className="alert alert-warning">This event is full.</div>
      )}

      {message && <p className="mt-3 text-success">{message}</p>}

      <TrailMap lat={event.lat} lng={event.lng} title={event.title} />
    </div>
  );
}
