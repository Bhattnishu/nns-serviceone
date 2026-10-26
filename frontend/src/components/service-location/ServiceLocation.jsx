
import { MapPin, Building2, Map, Hash } from "lucide-react";

import "./ServiceLocation.css";

const ServiceLocation = ({ provider }) => {
    const locationDetails = [
        {
            label: "Local area",
            value: provider.service_area,
            Icon: MapPin,
        },
        {
            label: "District",
            value: provider.service_district,
            Icon: Building2,
        },
        {
            label: "State",
            value: provider.service_state,
            Icon: Map,
        },
        {
            label: "PIN code",
            value: provider.service_pincode,
            Icon: Hash,
        },
    ].filter(
        (item) =>
            item.value !== null &&
            item.value !== undefined &&
            String(item.value).trim() !== ""
    );

    return (
        <section className="service-location-section">
            <h2>Service location</h2>

            {locationDetails.length > 0 ? (
                <div className="service-location-list">
                    {locationDetails.map(({ label, value, Icon }) => (
                        <div className="service-location-item" key={label}>
                            <Icon
                                className="service-location-icon"
                                size={20}
                                aria-hidden="true"
                            />

                            <div className="service-location-text">
                                <span>{label}</span>
                                <strong>{value}</strong>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="service-location-empty">
                    Location details are not available.
                </p>
            )}
        </section>
    );
};

export default ServiceLocation;
