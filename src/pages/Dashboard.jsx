import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  increment,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "joinRequests"),
      where("organizerId", "==", user.uid),
      where("status", "==", "pending"),
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return unsub;
  }, [user]);

  const respond = async (request, newStatus) => {
    setProcessingId(request.id);
    setError("");
    try {
      if (newStatus === "accepted") {
        const eventRef = doc(db, "events", request.eventId);
        const eventSnap = await getDoc(eventRef);
        const eventData = eventSnap.data();

        if (eventData.currentHeadcount >= eventData.maxHeadcount) {
          setError("This event is already full — can't accept more requests.");
          setProcessingId(null);
          return;
        }

        await updateDoc(eventRef, { currentHeadcount: increment(1) });
      }

      await updateDoc(doc(db, "joinRequests", request.id), {
        status: newStatus,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="container py-5">Loading...</div>;

  return (
    <div className="container py-5" style={{ maxWidth: "700px" }}>
      <h2 className="mb-4">Pending Join Requests</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {requests.length === 0 && (
        <p className="text-muted">No pending requests right now.</p>
      )}

      {requests.map((r) => (
        <div className="card mb-3" key={r.id}>
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <p className="mb-1">
                <strong>{r.userName}</strong> wants to join{" "}
                <strong>{r.eventTitle}</strong>
              </p>
            </div>
            <div>
              <button
                className="btn btn-success btn-sm me-2"
                disabled={processingId === r.id}
                onClick={() => respond(r, "accepted")}
              >
                Accept
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                disabled={processingId === r.id}
                onClick={() => respond(r, "rejected")}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
