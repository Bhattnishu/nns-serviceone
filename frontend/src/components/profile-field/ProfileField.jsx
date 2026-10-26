
import "./ProfileField.css";

function ProfileField({
  label,
  value,
  editing,
  onChange,
  type = "text",
  required = false,
  maxLength,
}) {
  return (
    <div className="profile-field">
      <label className="profile-field-label">
        {label}
      </label>

      {editing ? (
        <input
          className="profile-field-input"
          type={type}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          maxLength={maxLength}
        />
      ) : (
        <p className="profile-field-value">
          {value || "Not provided"}
        </p>
      )}
    </div>
  );
}

export default ProfileField;
