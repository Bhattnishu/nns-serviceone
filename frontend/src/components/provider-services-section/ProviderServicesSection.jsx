
import { BriefcaseBusiness } from "lucide-react";

import ProviderServiceCard from "../provider-service-card/ProviderServiceCard";

import "./ProviderServicesSection.css";

const ProviderServicesSection = ({ provider }) => {
    const services = provider.services || [];

    return (
        <section className="provider-services-section">
            <div className="provider-services-heading">
                <div>
                    <p className="provider-services-eyebrow">
                        AVAILABLE OFFERINGS
                    </p>

                    <h2>Services offered</h2>
                </div>

                <p className="provider-services-count">
                    {services.length}{" "}
                    {services.length === 1 ? "service" : "services"}
                </p>
            </div>

            {services.length > 0 ? (
                <div className="provider-services-grid">
                    {services.map((service) => (
                        <ProviderServiceCard
                            key={service.id}
                            providerId={provider.id}
                            service={service}
                        />
                    ))}
                </div>
            ) : (
                <div className="provider-services-empty">
                    <BriefcaseBusiness size={28} aria-hidden="true" />

                    <h3>No services listed yet</h3>

                    <p>
                        This provider has not added any services yet.
                    </p>
                </div>
            )}
        </section>
    );
};

export default ProviderServicesSection;
