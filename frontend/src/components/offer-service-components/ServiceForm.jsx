
import "./ServiceForm.css";

const ServiceForm = ({
  serviceForm,
  categories,
  onChange,
  onSubmit,
  onCancel,
  editingServiceId,
  submitting,
  error,
  categoryError,
}) => {
  return (
    <section className="service-form-component">
      <h2>{editingServiceId !== null ? "Edit service" : "Add a service"}</h2>

      <form onSubmit={onSubmit} className="offer-service-form">
        {categoryError && (
          <p className="offer-service-error">{categoryError}</p>
        )}

        <label>
          Service category
          <select
            name="category"
            value={serviceForm.category}
            onChange={onChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Service name
          <input
            name="service_name"
            value={serviceForm.service_name}
            onChange={onChange}
            placeholder="e.g. Mathematics tutoring"
            required
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={serviceForm.description}
            onChange={onChange}
            placeholder="Describe the service you provide..."
            rows={4}
            required
          />
        </label>

        <label>
          Price (₹)
          <input
            type="number"
            name="price"
            value={serviceForm.price}
            onChange={onChange}
            min="0"
            step="0.01"
            placeholder="Enter your price"
            required
          />
        </label>

        {error && (
          <p className="offer-service-error" role="alert">
            {error}
          </p>
        )}

        <div className="offer-service-form-actions">
          <button type="submit" disabled={submitting}>
            {submitting
              ? "Saving..."
              : editingServiceId !== null
                ? "Update service"
                : "Submit service"}
          </button>

          {editingServiceId !== null && (
            <button
              type="button"
              className="offer-service-cancel-button"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

export default ServiceForm;
