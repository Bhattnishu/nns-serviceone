import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ServicePageSearch from "../../components/service-page-search/ServicePageSearch";
import api from "../../api/axios";
import ServicesHeader from "../../components/service-header/ServicesHeader";
import ServicesResultsHeading from "../../components/services-results-heading/ServicesResultsHeading";
import ProviderGrid from "../../components/provider-grid/ProviderGrid";

import "./Services.css";

const Services = () => {
    const [searchParams] = useSearchParams();

    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const totalServices = providers.reduce(
        (total, provider) => total + (provider.services?.length || 0),
        0
    );

    useEffect(() => {
        const fetchProviders = async () => {
            setLoading(true);
            setError("");

            try {
                const params = {
                    search: searchParams.get("search") || undefined,
                    pincode: searchParams.get("pincode") || undefined,
                    area: searchParams.get("area") || undefined,
                };

                const response = await api.get(
                    "/discovery/providers/",
                    { params }
                );

                setProviders(response.data);
            } catch (error) {
                console.error("Failed to fetch providers:", error);
                setError("Unable to load services. Please try again.");
                setProviders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProviders();
    }, [searchParams]);

    return (
        <main className="services-page">
            <ServicesHeader />
            <ServicePageSearch />

            {loading && (
                <p className="services-message" role="status">
                    Finding services...
                </p>
            )}

            {error && (
                <p className="services-error" role="alert">
                    {error}
                </p>
            )}

            {!loading && !error && totalServices === 0 && (
                <div className="services-empty">
                    <h2>No services found</h2>
                    <p>
                        Try another service, PIN code, or local area.
                    </p>
                </div>
            )}

            {!loading && !error && totalServices > 0 && (
                <>
                    <ServicesResultsHeading
                        totalServices={totalServices}
                        totalProviders={providers.length}
                    />

                    <ProviderGrid providers={providers} />
                </>
            )}
        </main>
    );
};

export default Services;