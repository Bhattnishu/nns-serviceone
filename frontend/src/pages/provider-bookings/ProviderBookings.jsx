
import { useEffect, useState } from "react";
import api from "../../api/axios";
import "./ProviderBookings.css";

const ProviderBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [selectedBooking, setSelectedBooking] = useState(null);

    const filters = [
        { label: "All", value: "ALL" },
        { label: "Pending", value: "PENDING" },
        { label: "Accepted", value: "ACCEPTED" },
        { label: "Rejected", value: "REJECTED" },
        { label: "Completed", value: "COMPLETED" },
    ];

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await api.get("/bookings/provider/");
            const data = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];
            setBookings(data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || "Unable to load booking requests.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    
    const updateBookingStatus = async (bookingId, newStatus) => {
        const action = newStatus.toLowerCase();

        if (!window.confirm(`Are you sure you want to ${action} this booking?`)) {
            return;
        }

        try {
            setUpdatingId(bookingId);
            setError("");

            // Update booking status
            await api.patch(`/bookings/${bookingId}/status/`, {
                status: newStatus,
            });

            // Fetch fresh booking data, including newly available contact details
            const response = await api.get("/bookings/provider/");

            const updatedBookings = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            setBookings(updatedBookings);

            const updatedBooking = updatedBookings.find(
                (booking) => booking.id === bookingId
            );

            if (updatedBooking) {
                setSelectedBooking(updatedBooking);
            }

        } catch (err) {
            console.error("Failed to update booking:", err);

            setError(
                err.response?.data?.detail ||
                err.response?.data?.status?.[0] ||
                "Unable to update booking status. Please try again."
            );
        } finally {
            setUpdatingId(null);
        }
    };


    const formatDate = (date) => {
        if (!date) return "Not available";

        return new Date(date).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getCount = (status) =>
        bookings.filter((booking) => booking.status === status).length;

    const formatStatus = (status) =>
        status.charAt(0) + status.slice(1).toLowerCase();

    const filteredBookings =
        activeFilter === "ALL"
            ? bookings
            : bookings.filter((booking) => booking.status === activeFilter);

    const renderActions = (booking) => (
        <div className="provider-booking-actions">
            {booking.status === "PENDING" && (
                <>
                    <button
                        type="button"
                        className="booking-accept-btn"
                        disabled={updatingId === booking.id}
                        onClick={() => updateBookingStatus(booking.id, "ACCEPTED")}
                    >
                        {updatingId === booking.id ? "Updating..." : "Accept"}
                    </button>

                    <button
                        type="button"
                        className="booking-reject-btn"
                        disabled={updatingId === booking.id}
                        onClick={() => updateBookingStatus(booking.id, "REJECTED")}
                    >
                        Reject
                    </button>
                </>
            )}

            {booking.status === "ACCEPTED" && (
                <button
                    type="button"
                    className="booking-complete-btn"
                    disabled={updatingId === booking.id}
                    onClick={() => updateBookingStatus(booking.id, "COMPLETED")}
                >
                    {updatingId === booking.id ? "Updating..." : "Mark Completed"}
                </button>
            )}
        </div>
    );

    return (
        <main className="provider-bookings-page">
            <div className="provider-bookings-container">
                <header className="provider-bookings-header">
                    <div>
                        <span className="provider-bookings-eyebrow">
                            PROVIDER DASHBOARD
                        </span>
                        <h1>Booking Requests</h1>
                        <p>Manage customer requests for your services.</p>
                    </div>

                    <button
                        type="button"
                        className="provider-bookings-refresh"
                        onClick={fetchBookings}
                        disabled={loading}
                    >
                        Refresh
                    </button>
                </header>

                <section className="provider-booking-stats">
                    <div className="provider-stat-card">
                        <span>Total Bookings</span>
                        <strong>{bookings.length}</strong>
                    </div>
                    <div className="provider-stat-card">
                        <span>Pending</span>
                        <strong>{getCount("PENDING")}</strong>
                    </div>
                    <div className="provider-stat-card">
                        <span>Accepted</span>
                        <strong>{getCount("ACCEPTED")}</strong>
                    </div>
                    <div className="provider-stat-card">
                        <span>Completed</span>
                        <strong>{getCount("COMPLETED")}</strong>
                    </div>
                </section>

                {error && (
                    <div className="provider-bookings-error" role="alert">
                        {error}
                    </div>
                )}

                {!loading && bookings.length > 0 && (
                    <div className="booking-filters">
                        {filters.map((filter) => (
                            <button
                                key={filter.value}
                                type="button"
                                className={`booking-filter-btn ${
                                    activeFilter === filter.value ? "active" : ""
                                }`}
                                onClick={() => setActiveFilter(filter.value)}
                            >
                                {filter.label} (
                                {filter.value === "ALL"
                                    ? bookings.length
                                    : getCount(filter.value)}
                                )
                            </button>
                        ))}
                    </div>
                )}

                {loading ? (
                    <div className="provider-bookings-empty">
                        Loading booking requests...
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="provider-bookings-empty">
                        <h2>No booking requests yet</h2>
                        <p>Customer booking requests will appear here.</p>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="provider-bookings-empty">
                        <h2>No {formatStatus(activeFilter)} bookings</h2>
                        <p>There are currently no bookings with this status.</p>
                    </div>
                ) : (
                    <section className="provider-booking-list">
                        {filteredBookings.map((booking) => (
                            <article className="provider-booking-card" key={booking.id}>
                                <div className="provider-booking-top">
                                    <div>
                                        <span className="provider-booking-label">
                                            SERVICE
                                        </span>
                                        <h2>{booking.service_name}</h2>
                                    </div>

                                    <span
                                        className={`provider-booking-status status-${booking.status.toLowerCase()}`}
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
                                            onClick={() => setSelectedBooking(booking)}
                                        >
                                            View Details
                                        </button>
                                        {renderActions(booking)}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </section>
                )}
            </div>

            {selectedBooking && (
                <div
                    className="booking-detail-overlay"
                    onClick={() => setSelectedBooking(null)}
                >
                    <div
                        className="booking-detail-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="booking-detail-header">
                            <div>
                                <span>BOOKING #{selectedBooking.id}</span>
                                <h2>Booking Details</h2>
                            </div>
                            <button
                                type="button"
                                className="booking-detail-close"
                                onClick={() => setSelectedBooking(null)}
                                aria-label="Close booking details"
                            >
                                ×
                            </button>
                        </div>

                        <div className="booking-detail-content">
                            <div className="booking-detail-service">
                                <span>Service</span>
                                <strong>{selectedBooking.service_name}</strong>
                            </div>

                            <div className="booking-detail-grid">
                                <div>
                                    <span>Customer</span>
                                    <strong>{selectedBooking.customer_name}</strong>
                                </div>
                                <div>
                                    <span>Status</span>
                                    <strong>{formatStatus(selectedBooking.status)}</strong>
                                </div>
                                <div>
                                    <span>Request date</span>
                                    <strong>{formatDate(selectedBooking.created_at)}</strong>
                                </div>
                                <div>
                                    <span>Preferred date</span>
                                    <strong>
                                        {formatDate(selectedBooking.preferred_date)}
                                    </strong>
                                </div>
                            </div>

                            <div className="booking-detail-section">
                                <span>Customer Message</span>
                                <p>{selectedBooking.message || "No message provided."}</p>
                            </div>

                            <div className="booking-detail-section">
                                <span>Customer Phone</span>
                                <p>
                                    {selectedBooking.customer_phone ||
                                        "Available after booking acceptance."}
                                </p>
                            </div>

                            <div className="booking-detail-section">
                                <span>Customer Address</span>
                                <p>
                                    {selectedBooking.address ||
                                        "Available after booking acceptance."}
                                </p>
                            </div>
                        </div>

                        <div className="booking-detail-footer">
                            {renderActions(selectedBooking)}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default ProviderBookings;
