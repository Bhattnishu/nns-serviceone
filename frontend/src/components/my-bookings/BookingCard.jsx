import "./BookingCard.css";

const BookingCard = ({
    booking,
    formatDate,
    formatStatus,
    onCancel,
    cancellingId,
}) => {
    const canCancel = ["PENDING", "ACCEPTED"].includes(booking.status);

    return (
        <article className="booking-card">
            <div className="booking-card-top">
                <div className="booking-service-info">
                    <span className="booking-service-label">
                        SERVICE REQUEST
                    </span>

                    <h2>{booking.service_name}</h2>
                </div>

                <span
                    className={`booking-status status-${(
                        booking.status || ""
                    ).toLowerCase()}`}
                >
                    {formatStatus(booking.status)}
                </span>
            </div>

            <div className="booking-details-grid">
                <div className="booking-detail">
                    <span>Provider</span>
                    <strong>
                        {booking.provider_name || "Not available"}
                    </strong>
                </div>

                <div className="booking-detail">
                    <span>Requested on</span>
                    <strong>{formatDate(booking.created_at)}</strong>
                </div>

                {booking.preferred_date && (
                    <div className="booking-detail">
                        <span>Preferred date</span>
                        <strong>{formatDate(booking.preferred_date)}</strong>
                    </div>
                )}

                {booking.address && (
                    <div className="booking-detail">
                        <span>Service address</span>
                        <strong>{booking.address}</strong>
                    </div>
                )}
            </div>

            {booking.provider_phone && (
                <div className="booking-contact">
                    <div className="booking-contact-icon">☎</div>

                    <div>
                        <span>Provider contact</span>
                        <strong>{booking.provider_phone}</strong>
                    </div>
                </div>
            )}

            {booking.message && (
                <div className="booking-message">
                    <span>Your message</span>
                    <p>{booking.message}</p>
                </div>
            )}

            <div className="booking-card-footer">
                <span className="booking-id">
                    Booking #{booking.id}
                </span>

                {canCancel && (
                    <button
                        type="button"
                        className="cancel-booking-btn"
                        onClick={() => onCancel(booking.id)}
                        disabled={cancellingId === booking.id}
                    >
                        {cancellingId === booking.id
                            ? "Cancelling..."
                            : "Cancel Booking"}
                    </button>
                )}
            </div>
        </article>
    );
};

export default BookingCard;