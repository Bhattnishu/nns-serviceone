import "./ProviderBookingFilters.css";

const ProviderBookingFilters = ({
    filters,
    bookings,
    activeFilter,
    onFilterChange,
    getCount,
}) => {
    return (
        <div className="provider-booking-filters">
            {filters.map((filter) => (
                <button
                    key={filter.value}
                    type="button"
                    className={`provider-booking-filter-btn ${
                        activeFilter === filter.value ? "active" : ""
                    }`}
                    onClick={() => onFilterChange(filter.value)}
                >
                    {filter.label} (
                    {filter.value === "ALL"
                        ? bookings.length
                        : getCount(filter.value)}
                    )
                </button>
            ))}
        </div>
    );
};

export default ProviderBookingFilters;