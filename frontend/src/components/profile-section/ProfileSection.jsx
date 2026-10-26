
import "./ProfileSection.css";

function ProfileSection({ title, children }) {
  return (
    <section className="profile-section">
      <h2 className="profile-section-title">{title}</h2>

      <div className="profile-section-content">
        {children}
      </div>
    </section>
  );
}

export default ProfileSection;
