import "./ProviderBookingCard.css";

const ProviderBookingCard = ({
    booking,
    formatDate,
    formatStatus,
    onViewDetails,
    renderActions,
}) => {
    return (
        <article className="provider-booking-card">
            <div className="provider-booking-top">
                <div>
                    <span className="provider-booking-label">
                        SERVICE
                    </span>

                    <h2>{booking.service_name}</h2>
                </div>

                <span
                    className={`provider-booking-status status-${(
                        booking.status || ""
                    ).toLowerCase()}`}
                >
                    {formatStatus(booking.status)}
                </span>
            </div>

            <div className="provider-booking-details">
                <div>
                    <span>Customer</span>
                    <strong>{booking.customer_name}</strong>
                </div>

                <div>
                    <span>Requested on</span>
                    <strong>{formatDate(booking.created_at)}</strong>
                </div>
            </div>

            <div className="provider-booking-footer">
                <span>Booking #{booking.id}</span>

                <div className="provider-booking-actions">
                    <button
                        type="button"
                        className="booking-view-btn"
                        onClick={() => onViewDetails(booking)}
                    >
                        View Details
                    </button>

                    {renderActions(booking)}
                </div>
            </div>
        </article>
    );
};

export default ProviderBookingCard;