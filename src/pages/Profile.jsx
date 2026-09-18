import { auth } from "../firebase";

function Profile() {
  return (
    <div>
      <h1>Profile Page</h1>
      <div className="card" style={{ width: "18rem" }}>
        <img
          src={auth.currentUser.photoURL}
          className="card-img-top"
          alt="Profile"
        />
        <div className="card-body">
          <h5 className="card-title">{auth.currentUser.displayName}</h5>
          <p className="card-text">{auth.currentUser.email}</p>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            Joined: {auth.currentUser.metadata.creationTime}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Profile;
