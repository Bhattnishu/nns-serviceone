import "./ProviderBookingStats.css";

const ProviderBookingStats = ({ bookings, getCount }) => {
    const stats = [
        {
            label: "Total Bookings",
            value: bookings.length,
        },
        {
            label: "Pending",
            value: getCount("PENDING"),
        },
        {
            label: "Accepted",
            value: getCount("ACCEPTED"),
        },
        {
            label: "Completed",
            value: getCount("COMPLETED"),
        },
    ];

    return (
        <section className="provider-booking-stats">
            {stats.map((stat) => (
                <div className="provider-stat-card" key={stat.label}>
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                </div>
            ))}
        </section>
    );
};

export default ProviderBookingStats;