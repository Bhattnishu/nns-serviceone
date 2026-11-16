
import { useEffect, useState } from "react";
import api from "../../api/axios";
import "./MyBookings.css";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingId, setCancellingId] = useState(null);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/bookings/my/");

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            setBookings(data);
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to load your bookings. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (bookingId) => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmed) return;

        try {
            setCancellingId(bookingId);
            setError("");

            await api.patch(`/bookings/${bookingId}/cancel/`);

            setBookings((previous) =>
                previous.map((booking) =>
                    booking.id === bookingId
                        ? { ...booking, status: "CANCELLED", provider_phone: null }
                        : booking
                )
            );
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to cancel this booking. Please try again."
            );
        } finally {
            setCancellingId(null);
        }
    };

    const formatDate = (date) => {
        if (!date) return "Not available";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const formatStatus = (status) => {
        return status.charAt(0) + status.slice(1).toLowerCase();
    };

    return (
        <main className="my-bookings-page">
            <div className="my-bookings-container">
                <header className="my-bookings-header">
                    <div>
                        <span className="my-bookings-eyebrow">
                            YOUR ACTIVITY
                        </span>
                        <h1>My Bookings</h1>
                        <p>
                            Track your service requests and manage your bookings.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="refresh-bookings-btn"
                        onClick={fetchBookings}
                        disabled={loading}
                    >
                        Refresh
                    </button>
                </header>

                {error && (
                    <div className="bookings-error">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="bookings-state">
                        Loading your bookings...
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="bookings-empty">
                        <div className="bookings-empty-icon">📋</div>
                        <h2>No bookings yet</h2>
                        <p>
                            When you request a service, your bookings will
                            appear here.
                        </p>
                    </div>
                ) : (
                    <div className="bookings-list">
                        {bookings.map((booking) => (
                            <article
                                className="booking-card"
                                key={booking.id}
                            >
                                <div className="booking-card-top">
                                    <div>
                                        <span className="booking-service-label">
                                            SERVICE
                                        </span>
                                        <h2>{booking.service_name}</h2>
                                    </div>

                                    <span
                                        className={`booking-status status-${booking.status.toLowerCase()}`}
                                    >
                                        {formatStatus(booking.status)}
                                    </span>
                                </div>

                                <div className="booking-details-grid">
                                    <div className="booking-detail">
                                        <span>Provider</span>
                                        <strong>{booking.provider_name}</strong>
                                    </div>

                                    <div className="booking-detail">
                                        <span>Requested on</span>
                                        <strong>
                                            {formatDate(booking.created_at)}
                                        </strong>
                                    </div>

                                    {booking.provider_phone && (
                                        <div className="booking-detail">
                                            <span>Provider contact</span>
                                            <strong>{booking.provider_phone}</strong>
                                        </div>
                                    )}
                                </div>

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

                                    {["PENDING", "ACCEPTED"].includes(
                                        booking.status
                                    ) && (
                                        <button
                                            type="button"
                                            className="cancel-booking-btn"
                                            onClick={() =>
                                                handleCancel(booking.id)
                                            }
                                            disabled={
                                                cancellingId === booking.id
                                            }
                                        >
                                            {cancellingId === booking.id
                                                ? "Cancelling..."
                                                : "Cancel Booking"}
                                        </button>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default MyBookings;
