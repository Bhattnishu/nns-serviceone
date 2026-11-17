import "./BookingDetailsModal.css";

const BookingDetailsModal = ({
    booking,
    formatDate,
    formatStatus,
    onClose,
    renderActions,
}) => {
    return (
        <div
            className="booking-detail-overlay"
            onClick={onClose}
        >
            <div
                className="booking-detail-modal"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="booking-detail-title"
            >
                <div className="booking-detail-header">
                    <div>
                        <span>BOOKING #{booking.id}</span>
                        <h2 id="booking-detail-title">
                            Booking Details
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="booking-detail-close"
                        onClick={onClose}
                        aria-label="Close booking details"
                    >
                        ×
                    </button>
                </div>

                <div className="booking-detail-content">
                    <div className="booking-detail-service">
                        <span>Service</span>
                        <strong>{booking.service_name}</strong>
                    </div>

                    <div className="booking-detail-grid">
                        <div>
                            <span>Customer</span>
                            <strong>{booking.customer_name}</strong>
                        </div>

                        <div>
                            <span>Status</span>
                            <strong>{formatStatus(booking.status)}</strong>
                        </div>

                        <div>
                            <span>Request date</span>
                            <strong>{formatDate(booking.created_at)}</strong>
                        </div>

                        <div>
                            <span>Preferred date</span>
                            <strong>{formatDate(booking.preferred_date)}</strong>
                        </div>
                    </div>

                    <div className="booking-detail-section">
                        <span>Customer Message</span>
                        <p>
                            {booking.message || "No message provided."}
                        </p>
                    </div>

                    <div className="booking-detail-section">
                        <span>Customer Phone</span>
                        <p>
                            {booking.customer_phone ||
                                "Available after booking acceptance."}
                        </p>
                    </div>

                    <div className="booking-detail-section">
                        <span>Customer Address</span>
                        <p>
                            {booking.address ||
                                "Available after booking acceptance."}
                        </p>
                    </div>
                </div>

                <div className="booking-detail-footer">
                    {renderActions(booking)}
                </div>
            </div>
        </div>
    );
};

export default BookingDetailsModal;