
import "./ProfileHeader.css";

function ProfileHeader({ editing, onEdit }) {
  return (
    <div className="profile-header">
      <div>
        <h1>My Profile</h1>
        <p>Manage your personal information</p>
      </div>

      {!editing && (
        <button
          type="button"
          className="profile-header-edit-button"
          onClick={onEdit}
        >
          Edit Profile
        </button>
      )}
    </div>
  );
}

export default ProfileHeader;
