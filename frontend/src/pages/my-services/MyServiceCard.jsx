import "./MyServiceCard.css";

const MyServiceCard = ({
    service,
    getStatusLabel,
    getVisibilityMessage,
    onEdit,
    onDelete,
    deletingId,
}) => {
    return (
        <article className="my-service-card">
            <div className="my-service-card-header">
                <h2>{service.service_name}</h2>

                <span
                    className={`service-status ${service.status?.toLowerCase()}`}
                >
                    {getStatusLabel(service.status)}
                </span>
            </div>

            <p className="my-service-description">
                {service.description}
            </p>

            <p className="service-visibility">
                {getVisibilityMessage(service.status)}
            </p>

            <div className="my-service-details">
                <p>
                    <strong>Price:</strong> ₹{service.price}
                </p>
            </div>

            <div className="my-service-actions">
                <button
                    type="button"
                    className="edit-service-btn"
                    onClick={() => onEdit(service)}
                >
                    Edit
                </button>

                <button
                    type="button"
                    className="delete-service-btn"
                    onClick={() => onDelete(service)}
                    disabled={deletingId === service.id}
          s      >
                    {deletingId === service.id
                        ? "Deleting..."
                        : "Delete"}
                </button>
            </div>
        </article>
    );
};

export default MyServiceCard;
