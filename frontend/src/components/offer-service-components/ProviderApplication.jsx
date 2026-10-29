
import "./ProviderApplication.css";

const ProviderApplication = ({
  formData,
  onChange,
  onSubmit,
  error,
  submitting,
}) => {
  return (
    <main className="offer-service-page">
      <div className="offer-service-container">
        <header className="offer-service-header">
          <h1>Become a ServiceOne Provider</h1>
          <p>
            Share your skills with people in your community.
            Complete your provider profile to apply.
          </p>
        </header>

        <section className="offer-service-card">
          <h2>Provider application</h2>

          <p className="offer-service-message">
            Tell us about your skills and where you provide services.
            Your application will be reviewed before you can publish services.
          </p>

          <form onSubmit={onSubmit} className="offer-service-form">
            <label>
              About you and your services
              <textarea
                name="description"
                value={formData.description}
                onChange={onChange}
                placeholder="Describe your skills and experience..."
                required
                rows={4}
              />
            </label>

            <label>
              Years of experience
              <input
                type="number"
                name="experience_years"
                value={formData.experience_years}
                onChange={onChange}
                min="0"
                required
              />
            </label>

            <label>
              Area / locality
              <input
                name="service_area"
                value={formData.service_area}
                onChange={onChange}
                placeholder="e.g. your neighbourhood"
                required
              />
            </label>

            <label>
              District / city
              <input
                name="service_district"
                value={formData.service_district}
                onChange={onChange}
                required
              />
            </label>

            <label>
              State
              <input
                name="service_state"
                value={formData.service_state}
                onChange={onChange}
                required
              />
            </label>

            <label>
              PIN code
              <input
                type="text"
                name="service_pincode"
                value={formData.service_pincode}
                onChange={onChange}
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="6-digit PIN code"
                required
              />
            </label>

            {error && (
              <p className="offer-service-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit application"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default ProviderApplication;
