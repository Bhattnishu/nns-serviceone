import { useEffect, useState } from "react";
import api from "../../api/axios";
import BookingStats from "../../components/my-bookings/BookingStats";
import BookingFilters from "../../components/my-bookings/BookingFilters";
import BookingCard from "../../components/my-bookings/BookingCard";
import "./MyBookings.css";

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

    const getCount = (status) =>
        bookings.filter((booking) => booking.status === status).length;

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

                {error && (
                    <div className="bookings-error" role="alert">
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
                        {bookings.length > 0 && (
                            <BookingStats stats={stats} />
                        )}

                        {bookings.length > 0 && (
                            <BookingFilters
                                bookings={bookings}
                                filteredCount={filteredBookings.length}
                                activeFilter={activeFilter}
                                onFilterChange={setActiveFilter}
                                getCount={getCount}
                            />
                        )}

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

                                <h2>
                                    No {activeFilter.toLowerCase()} bookings
                                </h2>

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
                            <div className="bookings-list">
                                {filteredBookings.map((booking) => (
                                    <BookingCard
                                        key={booking.id}
                                        booking={booking}
                                        formatDate={formatDate}
                                        formatStatus={formatStatus}
                                        onCancel={handleCancel}
                                        cancellingId={cancellingId}
                                    />
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