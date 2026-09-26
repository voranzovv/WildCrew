import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();
  console.log(user);
  return (
    <div>
      <h1>Profile Page</h1>
      <div className="card" style={{ width: "18rem" }}>
        <img src={user.photoURL} className="card-img-top" alt="Profile" />
        <div className="card-body">
          <h5 className="card-title">{user.displayName}</h5>
          <p className="card-text">{user.email}</p>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            Joined: {user.metadata.creationTime}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Profile;
