
import { Link, useLocation } from "react-router-dom";
import { MapPin, UserRound } from "lucide-react";

import "./ProviderCard.css";

const ProviderCard = ({ provider, service }) => {
    const currentLocation = useLocation();

    const serviceLocation = [
        provider.service_area,
        provider.service_district,
        provider.service_state,
    ]
        .filter((part) => part && part.trim())
        .join(", ");

    const hasPrice =
        service.price !== null &&
        service.price !== undefined &&
        service.price !== "";

    const returnTo =
        `${currentLocation.pathname}${currentLocation.search}${currentLocation.hash}`;

    return (
        <article className="provider-card">
            <div className="provider-card-content">
                <div className="provider-card-header">
                    <div className="provider-card-heading">
                        <span className="provider-card-category">
                            {service.category_name || "Local service"}
                        </span>

                        <h2 className="provider-card-service-name">
                            {service.service_name}
                        </h2>
                    </div>

                    <div className="provider-card-image-wrapper">
                        {provider.profile_photo ? (
                            <img
                                className="provider-card-image"
                                src={provider.profile_photo}
                                alt={`${provider.user_name}'s profile`}
                                loading="lazy"
                            />
                        ) : (
                            <div className="provider-card-image-placeholder">
                                {provider.user_name?.charAt(0).toUpperCase() || "P"}
                            </div>
                        )}
                    </div>
                </div>

                <p className="provider-card-description">
                    {service.description || provider.description}
                </p>

                <div className="provider-card-provider">
                    <div className="provider-card-provider-name">
                        <UserRound
                            className="provider-card-icon"
                            aria-hidden="true"
                        />
                        <span>{provider.user_name}</span>
                    </div>

                    {provider.experience_years > 0 && (
                        <span className="provider-card-experience">
                            {provider.experience_years} years' experience
                        </span>
                    )}
                </div>

                <div
                    className={`provider-card-location ${
                        !serviceLocation ? "is-empty" : ""
                    }`}
                >
                    {serviceLocation && (
                        <>
                            <MapPin
                                className="provider-card-icon"
                                aria-hidden="true"
                            />
                            <span>{serviceLocation}</span>
                        </>
                    )}
                </div>

                <div className="provider-card-footer">
                    <div className="provider-card-price">
                        {hasPrice && (
                            <strong>
                                {new Intl.NumberFormat("en-IN", {
                                    style: "currency",
                                    currency: "INR",
                                    maximumFractionDigits: 2,
                                }).format(Number(service.price))}
                            </strong>
                        )}
                    </div>

                    <Link
                        to={`/providers/${provider.id}/services/${service.id}`}
                        state={{ returnTo }}
                        className="provider-card-details"
                    >
                        View Details
                        <span aria-hidden="true">→</span>
                    </Link>
                </div>
            </div>
        </article>
    );
};

export default ProviderCard;
