import { Link } from "react-router-dom";
import { auth } from "../firebase";

function EventCard({
  title,
  location,
  date,
  difficulty,
  currentHeadcount,
  maxHeadcount,
  likeCount,
  coverImage,
  id,
}) {
  return (
    <div className="col-md-4" key={id}>
      <Link to={`/event/${id}`} className="text-decoration-none text-dark">
        <div className="card h-100 shadow-sm">
          <img
            src={coverImage || auth.currentUser.photoURL}
            className="card-img-top"
            alt={title}
          />
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <p className="card-text mb-1">{location}</p>
            <p className="card-text mb-1">
              {date}
              <span className="text-capitalize">{difficulty}</span>
            </p>
            <p className="card-text mb-1">
              {currentHeadcount}/{maxHeadcount} joined
            </p>
            <p className="card-text text-muted small">
              <i class="bi bi-hand-thumbs-up"></i>
              {likeCount || 0}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default EventCard;
