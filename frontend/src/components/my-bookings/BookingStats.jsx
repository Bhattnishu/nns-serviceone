import "./BookingStats.css";

const BookingStats = ({ stats }) => {
    return (
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
    );
};

export default BookingStats;