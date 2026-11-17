import "./BookingFilters.css";

const filters = [
    { label: "All", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "Accepted", value: "ACCEPTED" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Rejected", value: "REJECTED" },
    { label: "Cancelled", value: "CANCELLED" },
];

const BookingFilters = ({
    bookings,
    filteredCount,
    activeFilter,
    onFilterChange,
    getCount,
}) => {
    return (
        <section className="booking-filter-section">
            <div className="booking-filter-heading">
                <h2>Your Requests</h2>
                <span>{filteredCount} booking(s)</span>
            </div>

            <div className="booking-filters">
                {filters.map((filter) => (
                    <button
                        key={filter.value}
                        type="button"
                        className={`booking-filter-btn ${
                            activeFilter === filter.value ? "active" : ""
                        }`}
                        onClick={() => onFilterChange(filter.value)}
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
    );
};

export default BookingFilters;