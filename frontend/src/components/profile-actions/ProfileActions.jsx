
import { useNavigate } from "react-router-dom";
import "./ProfileActions.css";

function ProfileActions() {
  const navigate = useNavigate();

  return (
    <div className="profile-actions">
      <button
        type="button"
        className="profile-action-card"
        onClick={() => navigate("/my-bookings")}
      >
        <span className="profile-action-icon">▤</span>

        <span className="profile-action-content">
          <span className="profile-action-title">My Bookings</span>
          <span className="profile-action-description">
            View and manage your service bookings.
          </span>
        </span>

        <span className="profile-action-arrow">→</span>
      </button>

      <button
        type="button"
        className="profile-action-card profile-action-highlight"
        onClick={() => navigate("/offer-service")}
      >
        <span className="profile-action-icon">＋</span>

        <span className="profile-action-content">
          <span className="profile-action-title">Offer Services</span>
          <span className="profile-action-description">
            Start offering your skills to local customers.
          </span>
        </span>

        <span className="profile-action-arrow">→</span>
      </button>
    </div>
  );
}

export default ProfileActions;
