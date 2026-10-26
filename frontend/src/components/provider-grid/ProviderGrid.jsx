import ProviderCard from "../provider-card/ProviderCard";
import "./ProviderGrid.css";

const ProviderGrid = ({ providers }) => {
    return (
        <section className="provider-grid" aria-label="Service listings">
            {providers.flatMap((provider) =>
                (provider.services || []).map((service) => (
                    <ProviderCard
                        key={`${provider.id}-${service.id}`}
                        provider={provider}
                        service={service}
                    />
                ))
            )}
        </section>
    );
};

export default ProviderGrid;