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
import EventCard from "../Components/EventCard";
import Filter from "../Components/Filter";

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
      <Filter />
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
          <EventCard
            title={event.title}
            key={event.id}
            location={event.location}
            date={event.date}
            difficulty={event.difficulty}
            currentHeadcount={event.currentHeadcount}
            maxHeadcount={event.maxHeadcount}
            likeCount={event.likeCount}
            image={event.image}
            id={event.id}
            lng={event.lng}
            lat={event.lat}
          />
        ))}
      </div>
    </div>
  );
}
