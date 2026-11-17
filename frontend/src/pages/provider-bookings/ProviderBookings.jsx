import { useEffect, useState } from "react";
import api from "../../api/axios";
import ProviderBookingStats from "../../components/provider-bookings/ProviderBookingStats";
import ProviderBookingFilters from "../../components/provider-bookings/ProviderBookingFilters";
import ProviderBookingCard from "../../components/provider-bookings/ProviderBookingCard";
import BookingDetailsModal from "../../components/provider-bookings/BookingDetailsModal";
import "./ProviderBookings.css";

const filters = [
    { label: "All", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "Accepted", value: "ACCEPTED" },
    { label: "Rejected", value: "REJECTED" },
    { label: "Completed", value: "COMPLETED" },
];

const ProviderBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [selectedBooking, setSelectedBooking] = useState(null);

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

            setError(
                err.response?.data?.detail ||
                "Unable to load booking requests."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const updateBookingStatus = async (bookingId, newStatus) => {
        const action = newStatus.toLowerCase();

        if (
            !window.confirm(
                `Are you sure you want to ${action} this booking?`
            )
        ) {
            return;
        }

        try {
            setUpdatingId(bookingId);
            setError("");

            await api.patch(`/bookings/${bookingId}/status/`, {
                status: newStatus,
            });

            // Fetch updated data so newly available contact details are included.
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

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Not available";
        }

        return parsedDate.toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getCount = (status) =>
        bookings.filter((booking) => booking.status === status).length;

    const formatStatus = (status) => {
        if (!status) return "Unknown";

        return status.charAt(0) + status.slice(1).toLowerCase();
    };

    const filteredBookings =
        activeFilter === "ALL"
            ? bookings
            : bookings.filter(
                (booking) => booking.status === activeFilter
            );

    const renderActions = (booking) => (
        <div className="provider-booking-actions">
            {booking.status === "PENDING" && (
                <>
                    <button
                        type="button"
                        className="booking-accept-btn"
                        disabled={updatingId === booking.id}
                        onClick={() =>
                            updateBookingStatus(booking.id, "ACCEPTED")
                        }
                    >
                        {updatingId === booking.id ? "Updating..." : "Accept"}
                    </button>

                    <button
                        type="button"
                        className="booking-reject-btn"
                        disabled={updatingId === booking.id}
                        onClick={() =>
                            updateBookingStatus(booking.id, "REJECTED")
                        }
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
                    onClick={() =>
                        updateBookingStatus(booking.id, "COMPLETED")
                    }
                >
                    {updatingId === booking.id
                        ? "Updating..."
                        : "Mark Completed"}
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

                        <p>
                            Manage customer requests for your services.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="provider-bookings-refresh"
                        onClick={fetchBookings}
                        disabled={loading}
                    >
                        {loading ? "Refreshing..." : "Refresh"}
                    </button>
                </header>

                <ProviderBookingStats
                    bookings={bookings}
                    getCount={getCount}
                />

                {error && (
                    <div
                        className="provider-bookings-error"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                {!loading && bookings.length > 0 && (
                    <ProviderBookingFilters
                        filters={filters}
                        bookings={bookings}
                        activeFilter={activeFilter}
                        onFilterChange={setActiveFilter}
                        getCount={getCount}
                    />
                )}

                {loading ? (
                    <div className="provider-bookings-empty">
                        Loading booking requests...
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="provider-bookings-empty">
                        <h2>No booking requests yet</h2>
                        <p>
                            Customer booking requests will appear here.
                        </p>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="provider-bookings-empty">
                        <h2>
                            No {formatStatus(activeFilter)} bookings
                        </h2>

                        <p>
                            There are currently no bookings with this status.
                        </p>
                    </div>
                ) : (
                    <section className="provider-booking-list">
                        {filteredBookings.map((booking) => (
                            <ProviderBookingCard
                                key={booking.id}
                                booking={booking}
                                formatDate={formatDate}
                                formatStatus={formatStatus}
                                onViewDetails={setSelectedBooking}
                                renderActions={renderActions}
                            />
                        ))}
                    </section>
                )}
            </div>

            {selectedBooking && (
                <BookingDetailsModal
                    booking={selectedBooking}
                    formatDate={formatDate}
                    formatStatus={formatStatus}
                    onClose={() => setSelectedBooking(null)}
                    renderActions={renderActions}
                />
            )}
        </main>
    );
};

export default ProviderBookings;