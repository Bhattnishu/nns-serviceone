import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import ProfileHeader from "../../components/profile-header/ProfileHeader";
import ProfileSection from "../../components/profile-section/ProfileSection";
import ProfileField from "../../components/profile-field/ProfileField";
import ProfileActions from "../../components/profile-actions/ProfileActions";
import "./Profile.css";

const emptyProfile = {
  name: "",
  email: "",
  phone: "",
  address: "",
  area: "",
  city: "",
  state: "",
  pincode: "",
};

const personalFields = [
  { name: "name", label: "Full Name", required: true },
  { name: "email", label: "Email Address", type: "email", required: true },
  { name: "phone", label: "Phone Number", required: true },
];

const addressFields = [
  { name: "address", label: "Street Address" },
  { name: "area", label: "Local Area" },
  { name: "city", label: "City" },
  { name: "state", label: "State" },
  { name: "pincode", label: "PIN Code", maxLength: 10 },
];

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(emptyProfile);
  const [draft, setDraft] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await api.get("/auth/me/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const profile = { ...emptyProfile, ...response.data };
        setUser(profile);
        setDraft(profile);
      } catch {
        setError("Unable to load your profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (field, value) => {
    setDraft((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const startEditing = () => {
    setDraft({ ...user });
    setError("");
    setSuccess("");
    setEditing(true);
  };

  const cancelEditing = () => {
    setDraft({ ...user });
    setEditing(false);
    setError("");
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await api.patch("/auth/me/", draft, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const updatedProfile = {
        ...emptyProfile,
        ...user,
        ...response.data,
      };

      setUser(updatedProfile);
      setDraft(updatedProfile);
      setEditing(false);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      const data = err.response?.data;

      if (data && typeof data === "object") {
        const messages = Object.entries(data).flatMap(([field, value]) =>
          (Array.isArray(value) ? value : [value]).map(
            (message) =>
              `${field === "non_field_errors" ? "" : `${field}: `}${message}`
          )
        );

        setError(messages.join(" ") || "Unable to update your profile.");
      } else {
        setError("Unable to update your profile. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const renderFields = (fields) =>
    fields.map((field) => (
      <ProfileField
        key={field.name}
        label={field.label}
        value={editing ? draft[field.name] : user[field.name]}
        editing={editing}
        type={field.type || "text"}
        required={field.required || false}
        maxLength={field.maxLength}
        onChange={(value) => handleChange(field.name, value)}
      />
    ));

  if (loading) {
    return <div className="profile-page">Loading profile...</div>;
  }

  return (
    <main className="profile-page">
      <div className="profile-container">
        <button
          type="button"
          className="profile-back-button"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>

        <ProfileHeader editing={editing} onEdit={startEditing} />

        {error && (
          <p className="profile-error" role="alert">
            {error}
          </p>
        )}

        {success && (
          <p className="profile-success" role="status">
            {success}
          </p>
        )}

        <form id="profile-edit-form" onSubmit={saveProfile}>
          <ProfileSection title="Personal Information">
            <div className="profile-fields">
              {renderFields(personalFields)}
            </div>
          </ProfileSection>


          <ProfileSection title="Saved Address">
            <div className="profile-fields">
              {renderFields(addressFields)}
            </div>
          </ProfileSection>

          {editing && (
            <div className="profile-edit-actions">
              <button
                type="button"
                className="profile-secondary-button"
                onClick={cancelEditing}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="profile-primary-button"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </form>

        <ProfileActions />
      </div>
    </main>
  );
}

export default Profile;
