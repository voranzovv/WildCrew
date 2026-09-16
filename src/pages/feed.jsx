import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "../firebase";

export default function Feed({ students }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(students);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const q = query(
      collection(db, "events"),
      where("date", ">=", today),
      orderBy("date", "asc"),
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setEvents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return unsub;
  }, []);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Upcoming Events</h2>
        <Link to="/create" className="btn btn-primary">
          + Create Event
        </Link>
      </div>

      {loading && <p>Loading events...</p>}
      {!loading && events.length === 0 && (
        <p className="text-muted">
          No upcoming events yet. Be the first to create one!
        </p>
      )}

      <div className="row g-4">
        {events.map((event) => (
          <div className="col-md-4" key={event.id}>
            <Link
              to={`/event/${event.id}`}
              className="text-decoration-none text-dark"
            >
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{event.title}</h5>
                  <p className="card-text mb-1">{event.location}</p>
                  <p className="card-text mb-1">
                    {event.date} &middot;{" "}
                    <span className="text-capitalize">{event.difficulty}</span>
                  </p>
                  <p className="card-text mb-1">
                    {event.currentHeadcount}/{event.maxHeadcount} joined
                  </p>
                  <p className="card-text text-muted small">
                    ❤️ {event.likeCount || 0}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
