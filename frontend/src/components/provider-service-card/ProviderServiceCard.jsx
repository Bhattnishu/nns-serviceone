
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import "./ProviderServiceCard.css";

const formatPrice = (price) => {
    if (
        price === null ||
        price === undefined ||
        String(price).trim() === "" ||
        !Number.isFinite(Number(price))
    ) {
        return "Price not listed";
    }

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(Number(price));
};

const ProviderServiceCard = ({ providerId, service }) => {
    return (
        <article className="provider-service-card">
            <span className="provider-service-category">
                {service.category_name || "Local service"}
            </span>

            <h3>{service.service_name}</h3>

            <p className="provider-service-description">
                {service.description ||
                    "No description is available yet."}
            </p>

            <p className="provider-service-price">
                {formatPrice(service.price)}
            </p>

            <Link
                to={`/providers/${providerId}/services/${service.id}`}
                className="provider-service-link"
            >
                View Service Details
                <ArrowRight size={16} aria-hidden="true" />
            </Link>
        </article>
    );
};

export default ProviderServiceCard;
