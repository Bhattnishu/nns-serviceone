
import { useEffect, useState } from "react";
import api from "../../api/axios";
import "./MyBookings.css";

const filters = [
    { label: "All", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "Accepted", value: "ACCEPTED" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Rejected", value: "REJECTED" },
    { label: "Cancelled", value: "CANCELLED" },
];

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingId, setCancellingId] = useState(null);
    const [activeFilter, setActiveFilter] = useState("ALL");

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
                        ? {
                            ...booking,
                            status: "CANCELLED",
                            provider_phone: null,
                        }
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

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Not available";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const formatStatus = (status) => {
        if (!status) return "Unknown";

        return status.charAt(0) + status.slice(1).toLowerCase();
    };

    const getCount = (status) => {
        return bookings.filter(
            (booking) => booking.status === status
        ).length;
    };

    const filteredBookings = bookings.filter((booking) =>
        activeFilter === "ALL"
            ? true
            : booking.status === activeFilter
    );

    const stats = [
        {
            label: "Total Bookings",
            value: bookings.length,
            className: "total",
        },
        {
            label: "Pending",
            value: getCount("PENDING"),
            className: "pending",
        },
        {
            label: "Accepted",
            value: getCount("ACCEPTED"),
            className: "accepted",
        },
        {
            label: "Completed",
            value: getCount("COMPLETED"),
            className: "completed",
        },
    ];

    return (
        <main className="my-bookings-page">
            <div className="my-bookings-container">

                {/* Page Header */}
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
                        {loading ? "Refreshing..." : "↻ Refresh"}
                    </button>
                </header>

                {/* Error Message */}
                {error && (
                    <div className="bookings-error">
                        <span>{error}</span>

                        <button
                            type="button"
                            onClick={fetchBookings}
                            disabled={loading}
                        >
                            Try again
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="bookings-state">
                        <div className="booking-loader"></div>
                        <p>Loading your bookings...</p>
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        {bookings.length > 0 && (
                            <section className="booking-stats">
                                {stats.map((stat) => (
                                    <div
                                        className={`booking-stat-card ${stat.className}`}
                                        key={stat.label}
                                    >
                                        <span>{stat.label}</span>
                                        <strong>{stat.value}</strong>
                                    </div>
                                ))}
                            </section>
                        )}

                        {/* Filters */}
                        {bookings.length > 0 && (
                            <section className="booking-filter-section">
                                <div className="booking-filter-heading">
                                    <h2>Your Requests</h2>
                                    <span>
                                        {filteredBookings.length} booking(s)
                                    </span>
                                </div>

                                <div className="booking-filters">
                                    {filters.map((filter) => (
                                        <button
                                            key={filter.value}
                                            type="button"
                                            className={`booking-filter-btn ${
                                                activeFilter === filter.value
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                setActiveFilter(filter.value)
                                            }
                                        >
                                            {filter.label}

                                            <span>
                                                {filter.value === "ALL"
                                                    ? bookings.length
                                                    : getCount(filter.value)}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Empty State */}
                        {bookings.length === 0 ? (
                            <div className="bookings-empty">
                                <div className="bookings-empty-icon">
                                    <span>▤</span>
                                </div>

                                <h2>No bookings yet</h2>

                                <p>
                                    When you request a service, your bookings
                                    will appear here. Find a service and get started!
                                </p>
                            </div>
                        ) : filteredBookings.length === 0 ? (
                            <div className="bookings-empty">
                                <div className="bookings-empty-icon">
                                    <span>⌕</span>
                                </div>

                                <h2>No {activeFilter.toLowerCase()} bookings</h2>

                                <p>
                                    You don't have any bookings with this status.
                                    Try selecting another filter.
                                </p>

                                <button
                                    type="button"
                                    className="clear-booking-filter"
                                    onClick={() => setActiveFilter("ALL")}
                                >
                                    View all bookings
                                </button>
                            </div>
                        ) : (
                            /* Booking Cards */
                            <div className="bookings-list">
                                {filteredBookings.map((booking) => (
                                    <article
                                        className="booking-card"
                                        key={booking.id}
                                    >
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
                                                <strong>
                                                    {formatDate(booking.created_at)}
                                                </strong>
                                            </div>

                                            {booking.preferred_date && (
                                                <div className="booking-detail">
                                                    <span>Preferred date</span>
                                                    <strong>
                                                        {formatDate(booking.preferred_date)}
                                                    </strong>
                                                </div>
                                            )}

                                            {booking.address && (
                                                <div className="booking-detail">
                                                    <span>Service address</span>
                                                    <strong>{booking.address}</strong>
                                                </div>
                                            )}
                                        </div>

                                        {/* Provider Contact */}
                                        {booking.provider_phone && (
                                            <div className="booking-contact">
                                                <div className="booking-contact-icon">
                                                    ☎
                                                </div>

                                                <div>
                                                    <span>Provider contact</span>
                                                    <strong>
                                                        {booking.provider_phone}
                                                    </strong>
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
                    </>
                )}
            </div>
        </main>
    );
};

export default MyBookings;
