
import "./MyServiceCard.css";

const MyServiceCard = ({ service, onEdit, onDelete, deleting }) => {
  const status = service.status || "PENDING";

  const statusLabels = {
    PENDING: "Pending review",
    APPROVED: "Approved",
    REJECTED: "Rejected",
  };

  return (
    <article className="my-service-card">
      <div className="my-service-card-header">
        <div>
          <h3>{service.service_name}</h3>
          <p className="my-service-category">
            {service.category_name || service.category?.name || "Service"}
          </p>
        </div>

        <span
          className={`my-service-status my-service-status-${status.toLowerCase()}`}
        >
          {statusLabels[status] || status}
        </span>
      </div>

      {service.description && (
        <p className="my-service-description">{service.description}</p>
      )}

      <p className="my-service-price">
        ₹{Number(service.price).toLocaleString("en-IN")}
      </p>

      {status === "REJECTED" && service.review_note && (
        <p className="my-service-review">
          Review feedback: {service.review_note}
        </p>
      )}

      <div className="my-service-actions">
        <button
          type="button"
          className="my-service-edit-button"
          onClick={() => onEdit(service)}
          disabled={deleting}
        >
          Edit
        </button>

        <button
          type="button"
          className="my-service-delete-button"
          onClick={() => onDelete(service)}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </article>
  );
};

export default MyServiceCard;
