
import "./ServiceOverview.css";

const ServiceOverview = ({ service, formattedPrice }) => {
    return (
        <div className="service-overview">
            <p className="service-overview-eyebrow">
                SERVICE DETAILS
            </p>

            <span className="service-overview-category">
                {service.category_name || "Local service"}
            </span>

            <h1 className="service-overview-title">
                {service.service_name}
            </h1>

            <p className="service-overview-description">
                {service.description ||
                    "No description is available for this service yet."}
            </p>

            <div className="service-overview-price">
                <span>Listed price</span>
                <strong>{formattedPrice}</strong>
            </div>
        </div>
    );
};

export default ServiceOverview;
